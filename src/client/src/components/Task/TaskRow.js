
import React from 'react'

import Grid from '@mui/material/Grid'

import { TaskDot } from './TaskDot'
import { TaskTitle } from './TaskTitle'
import { TaskPerWeekList } from './TaskPerWeekList'

export const TaskRow = ({ 
	size, 
	task, 
	assignments,
	removeTask,
	upsertTask
}) => {
	return (
		<Grid 
			container 
			spacing={2}
			columnSpacing={1}
			rowSpacing={1}
			direction="row"
			alignItems="center"
		>
			<Grid 
				item
				xs={1}
			>
				<TaskDot
					size={size}
					color={task.color}
					upsertTask={upsertTask}
				/>
			</Grid>
			<Grid 
				item
				xs={3}
			>
				<TaskTitle 
					size={size}
					title={task.title}
					removeTask={removeTask}
					upsertTask={upsertTask}
				/>
			</Grid>
			<Grid 
				item
				xs={8}
			>
				<TaskPerWeekList 
					size={size}
					color={task.color}
					task={task}
					timesPerWeek={task.timesPerWeek}
					assigned={
						assignments.filter(({ 
							taskKey
						}) => taskKey === task._key).length
					}
					upsertTask={upsertTask}
				/>
			</Grid>
		</Grid>
	)
}
