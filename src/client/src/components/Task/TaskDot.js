
import { useState } from 'react'

import Paper from '@mui/material/Paper'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

import { SwatchesPicker } from 'react-color'

export const TaskDot = ({ 
	size,
	color,
	upsertTask
}) => {
	const [ isSelectingColor, setIsSelectingColor ] = useState(false)
	return (
		<div>
			<CircleTwoToneIcon 
				style={{ 
					fontSize: size, 
					color
				}}
				onClick={({ target: { localName } }) => {
					if (isSelectingColor || localName !== 'circle') {
						setIsSelectingColor(false)
					}
					else {
						setIsSelectingColor(true)
					}
				}}
			/>
			{isSelectingColor && upsertTask &&
				<Paper 
					style={{ 
						zIndex: 1,
						position: 'absolute'
					}}
					elevation={24}
				>
					<SwatchesPicker
						onChangeComplete={({ hex: color }) => {
							upsertTask({ color })
							setIsSelectingColor(false)
						}}
					/>
				</Paper>
			}
		</div>
	)
}
