
import React from 'react'

import Paper from '@mui/material/Paper'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

export const TimeslotAssignments = ({ 
	size,
	timeslotAssignments
}) => (
	<Paper
		style={{ 
			margin: 5,
			height: 75
		}}
		elevation={6}
	>{timeslotAssignments.length > 0 &&
		timeslotAssignments.map(({ task: { title, color } }) => (
			<CircleTwoToneIcon 
				style={{ fontSize: size, color }}
				key={title}
			/>
		))
	}</Paper>
)
