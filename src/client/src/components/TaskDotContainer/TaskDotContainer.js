
import Grid from '@mui/material/Grid'

import TaskDot from '../TaskDot/TaskDot.js'

import './TaskDotContainer.css'

import React from 'react'

function TaskDotContainer({ 
	size,
	color,
	upsertTask
}) {
	if (color) {
		return (
			<Grid item xs={1}>
				<div style={{ height: size }}>
					<TaskDot 
						size={size}
						color={color}
						upsertTask={upsertTask}
					/>
				</div>
			</Grid>
		)
	}
}

export default TaskDotContainer
