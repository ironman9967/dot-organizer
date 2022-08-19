
import React from 'react'

import Grid from '@mui/material/Grid'

import { TaskRow } from './TaskRow.js'

export const TaskList = ({ 
	size, 
	data: { tasks, assignments },
	upsertTask
}) => {
	if (tasks) {
		return (
			<Grid
				container
				spacing={2}
				columnSpacing={1}
				rowSpacing={1} 
			>{
				tasks
					.sort((
						{ order: order1 }, 
						{ order: order2 }
					) => order1 - order2)
					.map(task => (
						<Grid
							item
							key={task.title}
							xs={12}
						>
							<TaskRow 
								size={size} 
								task={task} 
								assignments={assignments}
								upsertTask={upsertTask}
							/>
						</Grid>
					))
			}</Grid>
		)
	}
}
