
import { useState } from 'react'

import Paper from '@mui/material/Paper'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

import { GithubPicker } from 'react-color'

export const TaskDot = ({ 
	size,
	color,
	upsertTask
}) => {
	const [ isSelectingColor, setIsSelectingColor ] = useState(false)
	if (!color) return 
	return (
		<div>
			<CircleTwoToneIcon 
				style={{ 
					fontSize: size, 
					color,
					// paddingTop: 4.05
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
			{isSelectingColor &&
				<div style={{ 
					position: 'absolute',
					// left: '3.6%'
				}}>
					<Paper elevation={24} >
						<GithubPicker
							onChangeComplete={({ hex: color }) => {
								upsertTask({ color })
								setIsSelectingColor(false)
							}}
						/>
					</Paper>
				</div>
			}
		</div>
	)
}
