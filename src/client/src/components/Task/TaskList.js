
import React from 'react'

import Paper from '@mui/material/Paper'

import { TaskRow } from './TaskRow'

export const TaskList = ({ 
	size, 
	data: { tasks, assignments },
	upsertTask
}) => {
	if (!tasks) return
	return (
		<Paper
			style={{
				padding: 5,
				margin: 5
			}}
			elevation={24}
		>{
			tasks
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
							upsertTask={upsertTask}
						/>
					</Paper>
				))
		}</Paper>
	)
}
