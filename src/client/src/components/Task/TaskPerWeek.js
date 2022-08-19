
import React from 'react'

import Grid from '@mui/material/Grid'

import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'

export const TaskPerWeek = ({ 
	size,
	color,
	timesPerWeek,
	upsertTask
}) => {
	if (color) {
		return (
			<Grid item xs={5}>
				<div style={{ textAlign: 'right' }} >
					<IconButton>
						<RemoveCircleIcon
							style={{ fontSize: size }}
							onClick={() => upsertTask({
								timesPerWeek: timesPerWeek <= 0 ? 0 : timesPerWeek - 1
							})}
						/>
					</IconButton>
					{
						new Array(timesPerWeek).fill(null).map((n, i) => (
							<CircleTwoToneIcon 
								style={{ fontSize: Math.ceil(size), color }}
								key={i}
							/>
						))
					}
					<IconButton>
						<AddCircleIcon
							style={{ fontSize: size }}
							onClick={() => upsertTask({
								timesPerWeek: timesPerWeek + 1
							})}
						/>
					</IconButton>
				</div>
			</Grid>
		)
	}
}
