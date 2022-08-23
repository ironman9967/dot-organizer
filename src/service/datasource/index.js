
export const createDatasource = ({ uuid }) => {
	const addMeta = obj => ({
		_key: uuid(),
		...obj
	})
	const addMetaToAll = objs => objs.map(addMeta)
	const initData = {
		timeslots: addMetaToAll([{
			order: 0,
			title: 'morning'
		}, {
			order: 1,
			title: 'lunch'
		}, {
			order: 2,
			title: 'afternoon'
		}, {
			order: 3,
			title: 'evening'
		}, {
			order: 4,
			title: `after kid's bedtime`
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
			timeslotTitle: 'morning', 
			taskTitle: 'Workout'
		}, {
			dayOfWeekTitle: 'Sunday',
			timeslotTitle: 'morning', 
			taskTitle: 'Laundry'
		}]
	}
	let data = initData
	const removeTimeslot = async keyToRemove => {
		data.timeslots = data.timeslots.reduce((newTimeslots, timeslot) => {
			if (timeslot._key !== keyToRemove) {
				newTimeslots.push(timeslot)
			}
			else {
				data.assignments
					.filter(({ timeslotTitle }) => timeslotTitle === timeslot.title)
					.forEach(({ taskTitle, timeslotTitle }) => removeAssignment({ 
						taskTitle,
						timeslotTitle
					}))				
			}
			return newTimeslots
		}, [])
	}
	const upsertTimeslot = async newTimeslot => {
		const timeslot = data.timeslots.find(({ 
			_key
		}) => _key === newTimeslot._key)
		if (timeslot) {
			await removeTimeslot(timeslot._key)
		}
		if (!newTimeslot.order) {
			newTimeslot.order = data.tasks.length
		}
		data.timeslots.push(addMeta(newTimeslot))
	}
	const removeTask = async keyToRemove => {
		data.tasks = data.tasks.reduce((newTasks, task) => {
			if (task._key !== keyToRemove) {
				newTasks.push(task)
			}
			else {
				data.assignments
					.filter(({ taskTitle }) => taskTitle === task.title)
					.forEach(({ taskTitle, timeslotTitle }) => removeAssignment({ 
						taskTitle,
						timeslotTitle
					}))
			}
			return newTasks
		}, [])
	}
	const upsertTask = async newTask => {
		const task = data.tasks.find(({ 
			_key
		}) => _key === newTask._key)
		if (task) {
			await removeTask(task._key)
		}
		if (!newTask.order) {
			newTask.order = data.tasks.length
		}
		data.tasks.push(addMeta(newTask))
	}
	const removeAssignment = async assignmentToRemove => 
		data.assignments = data.assignments.reduce((newAssignments, assignment) => {
			if (assignment.taskTitle !== assignmentToRemove.taskTitle
				|| assignment.timeslotTitle !== assignmentToRemove.timeslotTitle) {
				newAssignments.push(assignment)
			}
			return newAssignments
		}, [])
	const upsertAssignment = async newAssignment => {
		const assignment = data.assignments.find(({ 
			timeslotTitle,
			taskTitle
		}) => timeslotTitle === newAssignment.timeslotTitle
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
