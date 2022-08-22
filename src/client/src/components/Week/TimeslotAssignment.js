
import React from 'react'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

export const TimeslotAssignment = ({ 
	size,
	color,
	taskTitle,
	unassignThisTimeslot
}) => {
	return (
		<CircleTwoToneIcon 
			style={{ fontSize: size, color }}
			onDoubleClick={() => unassignThisTimeslot({ taskTitle })}
		/>
	)
}
