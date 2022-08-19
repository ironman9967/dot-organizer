
export const createEngine = ({
	createSubject,
	datasource: {
		getData,
		removeTimeslot,
		upsertTimeslot,
		removeTask,
		upsertTask,
		removeAssignment,
		upsertAssignment
	}
} = {}) => {
	const unsubs = []
	const { next, error, subscribe, filter } = createSubject()
	error(console.error)
	const { subscribe: onEngineUpdate } = 
		filter(({ event }) => event === 'update')
	const dataModification = async (method, arg) => {
		await method(arg)
		next({ event: 'update', data: await getData() })
	}
	return {
		startEngine: async () => {
			return {
				getData,
				onEngineUpdate,
				removeTimeslot: async beginToRemove => 
					dataModification(removeTimeslot, beginToRemove),
				upsertTimeslot: async newTimeslot => 
					dataModification(upsertTimeslot, newTimeslot),
				removeTask: async titleToRemove => 
					dataModification(removeTask, titleToRemove),
				upsertTask: async newTask => 
					dataModification(upsertTask, newTask),
				removeAssignment: async assignmentToRemove => 
					dataModification(removeAssignment, assignmentToRemove),
				upsertAssignment: async newAssignment => 
					dataModification(upsertAssignment, newAssignment)
			}
		},
		stopEngine: async () => {}
	}
}
