
import Grid from '@mui/material/Grid'

import './TaskTitle.css'

import React from 'react'

function TaskTitle({ title }) {
	if (title) {
		return (
			<Grid item xs={6}>
				<div style={{ textAlign: 'left' }}>
					{title}
				</div>
			</Grid>
		)
	}
}

export default TaskTitle
