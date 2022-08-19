
import Grid from '@mui/material/Grid'

import React from 'react'

export const TaskTitle = ({ title }) => {
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
