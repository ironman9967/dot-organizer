
import Grid from '@mui/material/Grid'

import TaskDotContainer from '../TaskDotContainer/TaskDotContainer.js'
import TaskTitle from '../TaskTitle/TaskTitle.js'

import './TaskRow.css'

import React from 'react'

function TaskRow({ 
	size, 
	task, 
	assignments,
	upsertTask
}) {
	if (task) {
		return (
			<Grid 
				container 
				spacing={2}
				direction="row"
				justifyContent="center"
				alignItems="center"
			>
				<TaskDotContainer 
					size={size}
					color={task.color}
					upsertTask={taskUpdates => {
						upsertTask({
							...task,
							...taskUpdates,
							_key: task._key
						})
					}}
				/>
				<TaskTitle title={task.title} />
			</Grid>
		)
	}
}

export default TaskRow
