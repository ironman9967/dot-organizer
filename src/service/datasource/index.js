
export const createDatasource = ({ uuid }) => {
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
			newTimeslot.order = data.timeslots.length + 1
		}
		data.timeslots.push(ensureMeta(newTimeslot))
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
			newTask.order = data.tasks.length + 1
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
		data.tasks.push(ensureMeta(newTask))
	}
	return {
		getData: async () => data,
		removeTimeslot,
		upsertTimeslot,
		removeTask,
		upsertTask,
		removeAssignment,
		upsertAssignment
	}
}
