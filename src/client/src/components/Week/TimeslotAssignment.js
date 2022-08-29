
import React from 'react'
import { useDrag } from 'react-dnd'

import Tooltip from '@mui/material/Tooltip'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

export const TimeslotAssignment = ({ 
	size,
	task: { title, color },
	assignment,
	removeAssignment
}) => {
	const [, dragRef] = useDrag({
		type: 'assign',
		item: assignment
	})
	return (
		<div ref={dragRef}>
			<Tooltip title={title}>
				<CircleTwoToneIcon
					style={{ fontSize: size, color, zIndex: 1 }}
					ref={dragRef}
					onDoubleClick={() => removeAssignment(assignment)}
				/>
			</Tooltip>
		</div>
	)
}
