
import React from 'react'

import Paper from '@mui/material/Paper'

import AddCircleIcon from '@mui/icons-material/AddCircle'

import { TaskRow } from './TaskRow'

export const TaskList = ({ 
	size, 
	data: { tasks, assignments },
	removeTask,
	upsertTask
}) => {
	if (!tasks) return
	const removeThisTask = _key => () => removeTask(_key)
	const upsertThisTask = task => taskUpdates => 
		upsertTask({
			...task,
			...taskUpdates,
			_key: task._key
		})
	return (
		<Paper
			style={{
				padding: 5,
				margin: 5
			}}
			elevation={24}
		>	
			{tasks
				.sort((
					{ order: order1 }, 
					{ order: order2 }
				) => order1 - order2)
				.map(task => (
					<Paper
						style={{ 
							padding: 5,
							margin: 5
						}}
						key={task._key}
						elevation={6}
					>
						<TaskRow 
							size={size} 
							task={task} 
							assignments={assignments}
							removeTask={removeThisTask(task._key)}
							upsertTask={upsertThisTask(task)}
						/>
					</Paper>
				))
			}
			<AddCircleIcon 
				style={{
					padding: 5,
					margin: 5,
					fontSize: size
				}}
				onClick={() => upsertTask({
					title: 'New Task',
					color: `#${Math.ceil(Math.random() * 0x1000000).toString(16)}`,
					timesPerWeek: 0
				})}
			/>
		</Paper>
	)
}
