
import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

export const DayOfWeekHeader = ({ margin, dayName }) => {
	if (!dayName) return
	return (
		<Grid
			style={{ margin }}
			item
			key={dayName}
			xs={1}
		>
			<Paper
				style={{ margin }}
				elevation={6}
			>
				{dayName}
			</Paper>
		</Grid>
	)
}
