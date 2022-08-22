
import React from 'react'

import Paper from '@mui/material/Paper'

export const TimeslotTitle = ({ title }) => {
	if (!title) return
	return (
		<Paper
			style={{ 
				margin: 5
			}}
			elevation={6}
		>
			{title}
		</Paper>
	)
}
