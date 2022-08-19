
import React from 'react'

import Grid from '@mui/material/Grid'

import { TaskDot } from './TaskDot.js'
import { TaskTitle } from './TaskTitle.js'
import { TaskPerWeek } from './TaskPerWeek.js'

export const TaskRow = ({ 
	size, 
	task, 
	assignments,
	upsertTask
}) => {
	if (task) {
		const upsertThisTask = taskUpdates => {
			upsertTask({
				...task,
				...taskUpdates,
				_key: task._key
			})
		}
		return (
			<Grid 
				container 
				spacing={2}
				direction="row"
				justifyContent="center"
				alignItems="center"
			>
				<TaskDot
					size={size}
					color={task.color}
					upsertTask={upsertThisTask}
				/>
				<TaskTitle title={task.title} />
				<TaskPerWeek 
					size={size}
					color={task.color}
					timesPerWeek={task.timesPerWeek}
					upsertTask={upsertThisTask}
				/>
			</Grid>
		)
	}
}
