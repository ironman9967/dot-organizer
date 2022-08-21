
import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { TaskRow } from './TaskRow'

export const TaskList = ({ 
	size, 
	data: { tasks, assignments },
	upsertTask
}) => {
	if (!tasks) return
	const style = { margin: 5 }
	return (
		<Paper
			style={{ margin: 15 }}
			elevation={24}
		>
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
							style={style}
							item
							key={task.title}
							xs={12}
						>
							<Paper
								style={style}
								elevation={6}
							>
								<TaskRow 
									size={size} 
									task={task} 
									assignments={assignments}
									upsertTask={upsertTask}
								/>
							</Paper>
						</Grid>
					))
			}</Grid>
		</Paper>
	)
}
