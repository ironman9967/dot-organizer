
export const createDatasource = ({ 
	uuid,
	createClient,
	url
}) => {
	const ensureMeta = obj => ({
		_key: obj._key ? obj._key : uuid(),
		...obj
	})
	const ensureMetaToAll = objs => objs.map(ensureMeta)
	const initData = {
		timeslots: ensureMetaToAll([{
			order: 0,
			title: 'New timeslot'
		}]),
		tasks: ensureMetaToAll([{
			order: 0,
			title: 'New Task',
			color: "#004dcf",
			timesPerWeek: 0
		}]),
		daysOfWeek: [{
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
		}],
		assignments: []
	}
	let data = initData
	const removeAssignment = async assignmentToRemove => 
		data.assignments = data.assignments.reduce((newAssignments, assignment) => {
			if (assignment.taskKey !== assignmentToRemove.taskKey
				|| assignment.timeslotKey !== assignmentToRemove.timeslotKey
				|| assignment.dayOfWeekTitle !== assignmentToRemove.dayOfWeekTitle) {
				newAssignments.push(assignment)
			}
			return newAssignments
		}, [])
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
		}
	}
	const removeTimeslot = async (keyToRemove, preserveAssignments = false) => {
		data.timeslots = data.timeslots.reduce((newTimeslots, timeslot) => {
			if (timeslot._key !== keyToRemove) {
				newTimeslots.push(timeslot)
			}
			else if (!preserveAssignments) {
				data.assignments
					.filter(({ timeslotKey }) => timeslotKey === timeslot._key)
					.forEach(removeAssignment)				
			}
			return newTimeslots
		}, [])
	}
	const upsertTimeslot = async newTimeslot => {
		const timeslot = data.timeslots.find(({ 
			_key
		}) => _key === newTimeslot._key)
		if (timeslot) {
			await removeTimeslot(timeslot._key, true)
			newTimeslot._key = timeslot._key
			newTimeslot.order = timeslot.order
		}
		if (newTimeslot.order === void 0) {
			newTimeslot.order = data.timeslots.length
		}
		data.timeslots.push(ensureMeta({
			order: newTimeslot.order,
			title: newTimeslot.title
		}))
	}
	const removeTask = async (keyToRemove, preserveAssignments = false) => {
		data.tasks = data.tasks.reduce((newTasks, task) => {
			if (task._key !== keyToRemove) {
				newTasks.push(task)
			}
			else if (!preserveAssignments) {
				data.assignments
					.filter(({ taskKey }) => taskKey === task._key)
					.forEach(removeAssignment)
			}
			return newTasks
		}, [])
	}
	const upsertTask = async newTask => {
		const task = data.tasks.find(({ 
			_key
		}) => _key === newTask._key)
		if (task) {
			await removeTask(task._key, true)
			newTask._key = task._key
			newTask.order = task.order
		}
		if (newTask.order === void 0) {
			newTask.order = data.tasks.length
		}
		if (newTask._key) {
			const assigned = data.assignments.filter(({ 
				taskKey
			}) => taskKey === newTask._key)
			while (assigned.length > newTask.timesPerWeek) {
				const toRemove = assigned.pop()
				await removeAssignment(toRemove, true)
			}
		}
		data.tasks.push(ensureMeta({
			order: newTask.order,
			title: newTask.title,
			color: newTask.color,
			timesPerWeek: newTask.timesPerWeek
		}))
	}
	const redisUrl = `redis(${url})`
	const timeout = procName => {
		let t = void 0
		const fail = () => {
			console.error(`"${procName}" timeout!!`)
			process.exit(1)
		}
		return {
			start: () => t = setTimeout(fail, 60000),
			clear: () => clearTimeout(t)
		}
	}
	const { start, clear } = timeout(redisUrl)
	const client = createClient({ url })
	let isConnected = false
	return {
		connect: async () => {
			start()
			client.on('connect', () => {
				isConnected = true
				clear()
				console.log(`connected to ${redisUrl}`)
			})
			client.on('disconnect', () => {
				isConnected = false
				start()
				console.log(`disconnected from ${redisUrl}`)
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
			const k = 'dot-org-key'
			await client.set(k, JSON.stringify({ some: 'data' }))
			const value = await client.get(k)
			console.log({ value })
		},
		disconnect: async () => {
			[ 'connect', 'disconnect', 'error' ]
				.map(e => client.removeAllListeners(e))
			clear()
			return isConnected ? client.quit() : void 0
		},
		getData: async () => data,
		removeTimeslot,
		upsertTimeslot,
		removeTask,
		upsertTask,
		removeAssignment,
		upsertAssignment
	}
}
