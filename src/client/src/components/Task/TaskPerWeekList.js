
import React from 'react'

import Grid from '@mui/material/Grid'

import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

import { TaskPerWeek } from './TaskPerWeek'

export const TaskPerWeekList = ({ 
	size,
	color,
	task,
	timesPerWeek,
	assigned,
	upsertTask
}) => {
	if (!color) return
	return (
		<Grid
			container 
			spacing={2}
			direction="row"
			justifyContent="right"
			alignItems="center"
		>
			<IconButton
				onClick={() => upsertTask({
					timesPerWeek: timesPerWeek <= 0 ? 0 : timesPerWeek - 1
				})}
			>
				<RemoveCircleIcon
					style={{ fontSize: size }}
				/>
			</IconButton>
			{
				new Array(timesPerWeek).fill(null).map((n, i) => {
					return (
						<TaskPerWeek
							key={i}
							size={size}
							color={color}
							task={task}
							isAssigned={i < assigned}
						/>
					)
				})
			}
			<IconButton
				onClick={() => upsertTask({
					timesPerWeek: timesPerWeek + 1
				})}
			>
				<AddCircleIcon
					style={{ fontSize: size }}
				/>
			</IconButton>
		</Grid>
	)
}
