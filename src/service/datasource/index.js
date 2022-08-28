
export const createDatasource = ({ 
	uuid,
	createSubject,
	createClient,
	url
}) => {
	const client = createClient({ url })
	
	const daysOfWeek = [{
		title: 'Sunday'
	}, {
		title: 'Monday'
	}, {
		title: 'Tuesday'
	}, {
		title: 'Wednesday'
	}, {
		title: 'Thursday'
	}, {
		title: 'Friday'
	}, {
		title: 'Saturday'
	}]

	const { 
		next: updateData,
		error,
		subscribe: onUpdate
	} = createSubject()
	error(console.error)

	const createQueue = () => {
		const { next, error, subscribe } = createSubject()
		error(console.error)

		let isConnected = false
		const q = []

		const processQueue = () => {
			if (!isConnected || q.length === 0) {
				return
			}
			setImmediate(async () => {
				while (isConnected && q.length > 0) {
					const { f, onComplete } = q.pop()
					onComplete(await f())
				}
			})
		}

		subscribe(({ isConnected: change }) => {
			isConnected = change
			console.log(`${isConnected 
				? 'connected to' 
				: 'disconnected from'
			} ${redisUrl}`)
			processQueue()
		})
		return { 
			queue: f => new Promise(resolve => {
				const { next, subscribe } = createSubject()
				const { unsubscribe } = subscribe((...args) => {
					unsubscribe()
					resolve.apply(resolve, args)
				})
				q.push({ f, onComplete: next })
				processQueue()
			}),
			setIsConnected: isConnected => next({ isConnected })
		}
	}

	const getKeys = (type, existingKey = void 0) => {
		const _key = existingKey === void 0 ? uuid() : existingKey
		return {
			_key,
			rkey: `${type}:${_key}`
		}
	}

	const data = { timeslots: [], tasks: [], daysOfWeek, assignments: [] }
	const { queue, setIsConnected } = createQueue()
	queue(async () => {
		const dbInitValue = '1'
		const isDbInit = await client.get('db-init') === dbInitValue
		if (!isDbInit) {
			await client.sendCommand([ 'flushall' ])
			client.SET('db-init', dbInitValue)
			const timeslot = await upsertTimeslot({
				order: 0,
				title: 'New timeslot'
			})
			const task = await upsertTask({
				order: 0,
				title: 'New task',
				color: '#004dcf',
				timesPerWeek: 0
			})
			data.timeslots = [ timeslot ]
			data.tasks = [ task ]
		}
		else {
			const processLoad = async rkeys => {
				const loadProms = rkeys => rkeys.map(rkey => client.HGETALL(rkey))
				const load = async rkeys => Promise.all(await loadProms(rkeys))
				return (await load(rkeys)).map(obj => Object.keys(obj).reduce((typed, k) => {
					typed[k] = k === 'order' || k === 'timesPerWeek'
						? parseInt(obj[k])
						: obj[k]
					return typed
				}, {}))
			}
			data.timeslots = await processLoad(await client.KEYS('timeslot:*'))
			data.tasks = await processLoad(await client.KEYS('task:*'))
			const assignments = await client.KEYS('assignment:*')
			data.assignments = assignments.map(rkey => {
				const [ ,, dayOfWeekTitle, ,timeslotKey, ,taskKey ] = rkey.split(':')
				return { dayOfWeekTitle, timeslotKey, taskKey }
			})
		}
		updateData(data)
	})

	const removeAssignment = async (assignmentToRemove, [
		suppressBroadcast = false
	] = []) => {
		data.assignments = data.assignments.reduce((newAssignments, assignment) => {
			if (assignment.taskKey !== assignmentToRemove.taskKey
				|| assignment.timeslotKey !== assignmentToRemove.timeslotKey
				|| assignment.dayOfWeekTitle !== assignmentToRemove.dayOfWeekTitle) {
				newAssignments.push(assignment)
			}
			return newAssignments
		}, [])
		queue(() => client.DEL(`assignment`
			+ `:dayOfWeekTitle:${assignmentToRemove.dayOfWeekTitle}`
			+ `:timeslotKey:${assignmentToRemove.timeslotKey}`
			+ `:taskKey:${assignmentToRemove.taskKey}`
		))
		if (!suppressBroadcast) {
			updateData(data)
		}
	}
	const upsertAssignment = async newAssignment => {
		const assignment = data.assignments.find(({ 
			timeslotKey,
			taskKey,
			dayOfWeekTitle
		}) => timeslotKey === newAssignment.timeslotKey
			&& taskKey === newAssignment.taskKey
			&& dayOfWeekTitle === newAssignment.dayOfWeekTitle)
		if (!assignment) {
			data.assignments.push(newAssignment)
			queue(() => client.SET(`assignment`
				+ `:dayOfWeekTitle:${newAssignment.dayOfWeekTitle}`
				+ `:timeslotKey:${newAssignment.timeslotKey}`
				+ `:taskKey:${newAssignment.taskKey}`,
				""
			))
			updateData(data)
		}
	}
	const removeTimeslot = async (keyToRemove, [
		suppressBroadcast = false,
		preserveAssignments = false
	] = []) => {
		let removed = void 0
		data.timeslots = data.timeslots.reduce((newTimeslots, timeslot) => {
			if (timeslot._key !== keyToRemove) {
				newTimeslots.push(timeslot)
			}
			else {
				removed = timeslot
				if (!preserveAssignments) {
					data.assignments
						.filter(({ timeslotKey }) => timeslotKey === timeslot._key)
						.forEach(assignment => removeAssignment(assignment, [ true ]))			
				}
			}
			return newTimeslots
		}, [])
		queue(async () => await client.HDEL(
			`timeslot:${keyToRemove}`, 
			'_key', 
			'order', 
			'title'
		))
		if (!suppressBroadcast) {
			updateData(data)
		}
		return removed
	}

	const upsertTimeslot = async newTimeslot => {
		const timeslot = data.timeslots.find(({ 
			_key
		}) => _key === newTimeslot._key)
		if (timeslot) {
			await removeTimeslot(timeslot._key, [ true, true ])
		}
		if (newTimeslot.order === void 0) {
			newTimeslot.order = timeslot 
				? timeslot.order
				: data.timeslots.length
		}
		const { rkey, _key } = getKeys('timeslot', newTimeslot._key)
		const t = { ...newTimeslot, _key }
		data.timeslots.push(t)
		queue(() => Object.keys(t).forEach(k => client.HSET(rkey, k, t[k])))
		updateData(data)
		return t
	}
	const removeTask = async (keyToRemove, [
		preserveAssignments = false,
		suppressBroadcast = false
	] = []) => {
		let removed = void 0
		data.tasks = data.tasks.reduce((newTasks, task) => {
			if (task._key !== keyToRemove) {
				newTasks.push(task)
			}
			else {
				removed = task
				if (!preserveAssignments) {
					data.assignments
						.filter(({ taskKey }) => taskKey === task._key)
						.forEach(assignment => removeAssignment(assignment, [ true ]))
				}
			}
			return newTasks
		}, [])
		await queue(() => client.HDEL(
			`task:${keyToRemove}`, 
			'_key', 
			'order', 
			'title', 
			'color', 
			'timesPerWeek'
		))
		if (!suppressBroadcast) {
			updateData(data)
		}
		return removed
	}
	const upsertTask = async newTask => {
		const task = data.tasks.find(({ 
			_key
		}) => _key === newTask._key)
		if (task) {
			await removeTask(task._key, [ true, true ])
		}
		if (newTask.order === void 0) {
			newTask.order = task 
				? task.order
				: data.tasks.length
		}
		if (newTask._key) {
			const assigned = data.assignments.filter(({ 
				taskKey
			}) => taskKey === newTask._key)
			while (assigned.length > newTask.timesPerWeek) {
				const toRemove = assigned.pop()
				await removeAssignment(toRemove, [ true ])
			}
		}
		const { rkey, _key } = getKeys('task', newTask._key)
		const t = { ...newTask, _key }
		data.tasks.push(t)
		queue(() => Object.keys(t).forEach(k => client.HSET(rkey, k, t[k])))
		updateData(data)
		return t
	}

	const redisUrl = `redis(${url})`
	const timeout = () => {
		let t = void 0
		const fail = () => {
			console.error(`"${redisUrl}" timeout!!`)
			process.exit(1)
		}
		return {
			start: () => t = setTimeout(fail, 60000),
			clear: () => clearTimeout(t)
		}
	}
	const { start, clear } = timeout()

	return {
		connect: async () => {
			start()
			client.on('connect', () => {
				clear()
				setIsConnected(true)
			})
			client.on('disconnect', () => {
				setIsConnected(false)
				start()
			})
			let printErr = true
			client.on('error', err => {
				if ([
					'ECONNREFUSED',
					'ENOTFOUND'
				].reduce((i, code) => i + err.toString().indexOf(code), 0) < 0) {
					return console.error(err)
				}
				if (printErr) {
					console.error(err)
					printErr = false
					setTimeout(() => printErr = true, 10000)
				}
			})
			console.log(`connecting to ${redisUrl}...`)
			await client.connect()
		},
		onUpdate,
		getData: () => data,
		removeTimeslot,
		upsertTimeslot,
		removeTask,
		upsertTask,
		removeAssignment,
		upsertAssignment
	}
}