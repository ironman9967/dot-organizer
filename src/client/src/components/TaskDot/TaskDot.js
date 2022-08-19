
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'
import { GithubPicker } from 'react-color'

import './TaskDot.css'

import { useState } from 'react'

function TaskDot({ 
	size,
	color,
	upsertTask
}) {
	const [ isSelectingColor, setIsSelectingColor ] = useState(false)
	if (color) {
		return (
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
		)
	}
}

export default TaskDot
