
import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

export const DayOfWeekHeader = ({ margin, title }) => {
	if (!title) return
	return (
		<Grid
			style={{ margin }}
			item
			xs={1}
		>
			<Paper
				style={{ margin }}
				elevation={6}
			>
				{title}
			</Paper>
		</Grid>
	)
}
