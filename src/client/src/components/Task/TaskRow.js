
import React from 'react'

import Grid from '@mui/material/Grid'

import { TaskDot } from './TaskDot'
import { TaskTitle } from './TaskTitle'
import { TaskPerWeekList } from './TaskPerWeekList'

export const TaskRow = ({ 
	size, 
	task, 
	assignments,
	upsertTask
}) => {
	if (!task) return
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
			alignItems="center"
		>
			<Grid item xs={1}>
				<TaskDot
					size={size}
					color={task.color}
					upsertTask={upsertThisTask}
				/>
			</Grid>
			<Grid item xs={3}>
				<TaskTitle title={task.title} />
			</Grid>
			<Grid item xs={8}>
				<TaskPerWeekList 
					size={size}
					color={task.color}
					task={task}
					timesPerWeek={task.timesPerWeek}
					assigned={
						assignments.filter(({ 
							taskTitle
						}) => taskTitle === task.title).length
					}
					upsertTask={upsertThisTask}
				/>
			</Grid>
		</Grid>
	)
}
