
import React from 'react'

import Paper from '@mui/material/Paper'

import { EditableTitle } from '../common/EditableTitle'

export const TimeslotTitle = ({ 
	size,
	title,
	removeTimeslot,
	upsertTimeslot
}) => {
	return (
		<Paper
			style={{ margin: 10 }}
			elevation={6}
		>
			<EditableTitle
				fullWidth
				size={size}
				title={title}
				onEdit={newTitle => upsertTimeslot({ title: newTitle })}
				onClick={() => removeTimeslot()}
			/>
		</Paper>
	)
}
