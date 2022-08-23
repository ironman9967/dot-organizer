
export const createDatasource = ({ uuid }) => {
	const addMeta = obj => ({
		_key: uuid(),
		...obj
	})
	const addMetaToAll = objs => objs.map(addMeta)
	const initData = {
		timeslots: addMetaToAll([{
			order: 0,
			title: 'morning',
			begin: 8, //8:00am
			duration: 14 // 3.5h (14 * 15m)
		}, {
			order: 1,
			title: 'lunch',
			begin: 1130, //11:30am
			duration: 6 // 1.5h
		}, {
			order: 2,
			title: 'afternoon',
			begin: 1300, //1:00pm
			duration: 16 // 4h
		}, {
			order: 3,
			title: 'evening',
			begin: 1700, //5:00pm
			duration: 14 // 3.5h
		}, {
			order: 4,
			title: `after kid's bedtime`,
			begin: 2030, //8:30pm
			duration: 12 // 3h
		}]),
		tasks: addMetaToAll([{
			order: 0,
			title: 'Family dinner',
			color: '#000000',
			timesPerWeek: 3
		}, {
			order: 1,
			title: 'Workout',
			color: '#00ffff',
			timesPerWeek: 6
		}, {
			order: 2,
			title: `Isaac's school`,
			color: '#ffff00',
			timesPerWeek: 5
		}, {
			order: 3,
			title: `Ellie's school`,
			color: '#0000ff',
			timesPerWeek: 5
		}, {
			order: 4,
			title: `Laundry`,
			color: '#ff0000',
			timesPerWeek: 2
		}, {
			order: 5,
			title: `Me time`,
			color: '#00ff00',
			timesPerWeek: 1
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
		assignments: [{
			dayOfWeekTitle: 'Sunday',
			timeslotBegin: 8, 
			taskTitle: 'Workout'
		}, {
			dayOfWeekTitle: 'Sunday',
			timeslotBegin: 8, 
			taskTitle: 'Laundry'
		}]
	}
	let data = initData
	const removeTimeslot = async keyToRemove => 
		data.timeslots = data.timeslots.reduce((newTimeslots, timeslot) => {
			if (timeslot._key !== keyToRemove) {
				newTimeslots.push(timeslot)
			}
			return newTimeslots
		}, [])
	const upsertTimeslot = async newTimeslot => {
		const timeslot = data.timeslots.find(({ 
			_key
		}) => _key === newTimeslot._key)
		if (timeslot) {
			await removeTimeslot(timeslot._key)
		}
		data.timeslots.push(addMeta(newTimeslot))
	}
	const removeTask = async keyToRemove => 
		data.tasks = data.tasks.reduce((newTasks, task) => {
			if (task._key !== keyToRemove) {
				newTasks.push(task)
			}
			return newTasks
		}, [])
	const upsertTask = async newTask => {
		const task = data.tasks.find(({ 
			_key
		}) => _key === newTask._key)
		if (task) {
			await removeTask(task._key)
		}
		data.tasks.push(addMeta(newTask))
	}
	const removeAssignment = async assignmentToRemove => 
		data.assignments = data.assignments.reduce((newAssignments, assignment) => {
			if (assignment.taskTitle !== assignmentToRemove.taskTitle
				|| assignment.timeslotBegin !== assignmentToRemove.timeslotBegin) {
				newAssignments.push(assignment)
			}
			return newAssignments
		}, [])
	const upsertAssignment = async newAssignment => {
		const assignment = data.assignments.find(({ 
			timeslotBegin,
			taskTitle
		}) => timeslotBegin === newAssignment.timeslotBegin
			&& taskTitle === newAssignment.taskTitle)
		if (!assignment) {
			data.assignments.push(newAssignment)
		}
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
