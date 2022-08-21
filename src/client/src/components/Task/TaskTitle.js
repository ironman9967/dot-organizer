
import Grid from '@mui/material/Grid'

import React from 'react'

export const TaskTitle = ({ title }) => {
	if (title) {
		return (
			<Grid 
				style={{ padding: 0 }}
				item
				xs={6}
			>
				<div style={{ textAlign: 'left' }}>
					{title}
				</div>
			</Grid>
		)
	}
}
