
import { useState } from 'react'

import Grid from '@mui/material/Grid'

import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

import { GithubPicker } from 'react-color'

export const TaskDot = ({ 
	size,
	color,
	upsertTask
}) => {
	const [ isSelectingColor, setIsSelectingColor ] = useState(false)
	if (color) {
		return (
			<Grid item xs={1}>
				<div>
					<div style={{ textAlign: 'right' }}>
						<CircleTwoToneIcon 
							style={{ fontSize: size, color }}
							onClick={({ target: { localName } }) => {
								if (isSelectingColor || localName !== 'circle') {
									setIsSelectingColor(false)
								}
								else {
									setIsSelectingColor(true)
								}
							}}
						/>
					</div>
					{isSelectingColor &&
						<div style={{ 
							position: 'absolute',
							paddingLeft: 87
						}}>
							<GithubPicker
								width={204}
								onChangeComplete={({ hex: color }) => {
									upsertTask({ color })
									setIsSelectingColor(false)
								}}
							/>
						</div>
					}
				</div>
			</Grid>
		)
	}
}
