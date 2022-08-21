
import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { DayOfWeekHeader } from './DayOfWeekHeader'

export const WeekGrid = ({ 
	size, 
	data: { timeslots, assignments }
}) => {
	const margin = 5
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
				direction="row"
				justifyContent="center"
				alignItems="center"
			>{
				[ 'Sun','Mon','Tue','Wed','Thu','Fri','Sat' ].map(d => (
					<DayOfWeekHeader margin={margin} dayName={d} />
				))
			}
			</Grid>
		</Paper>
	)
}
