
import React from 'react'
import { useDrag } from 'react-dnd'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'

export const TaskPerWeek = ({ size, color, isAssigned, task }) => {
	const [, dragRef] = useDrag(() => ({
		type: 'assign',
		item: { taskKey: task._key }
	}))
	const style = { fontSize: size, color }
	return isAssigned
		? (
			<CheckCircleTwoToneIcon 
				style={style}
			/>
		)
		: (
			<div ref={dragRef}>
				<CircleTwoToneIcon 
					style={{ ...style, cursor: 'move' }}
				/>
			</div>
		)
}
