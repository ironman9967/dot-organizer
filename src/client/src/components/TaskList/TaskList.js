
import TaskRow from '../TaskRow/TaskRow.js'
import Grid from '@mui/material/Grid'

import './TaskList.css'

import React from 'react'

function TaskList({ 
	size, 
	data: { tasks, assignments },
	upsertTask
}) {
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

export default TaskList
