
import React from 'react'

import Paper from '@mui/material/Paper'

import { EditableTitle } from '../common/EditableTitle'

export const TimeslotTitle = ({ 
	title,
	upsertTimeslot
}) => {
	return (
		<Paper
			style={{ margin: 5 }}
			elevation={6}
		>
			<EditableTitle
				fullWidth
				title={title}
				onEdit={newTitle => upsertTimeslot({ title: newTitle })}
			/>
		</Paper>
	)
}
