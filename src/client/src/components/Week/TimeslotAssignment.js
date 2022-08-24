
import React from 'react'
import { useDrag } from 'react-dnd'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

export const TimeslotAssignment = ({ 
	size,
	color,
	assignment,
	removeAssignment
}) => {
	const [, dragRef] = useDrag({
		type: 'assign',
		item: assignment
	})
	return (
		<div ref={dragRef}>
			<CircleTwoToneIcon
				style={{ fontSize: size, color, zIndex: 1 }}
				ref={dragRef}
				onDoubleClick={() => removeAssignment(assignment)}
			/>
		</div>
	)
}
