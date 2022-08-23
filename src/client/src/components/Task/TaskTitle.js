
import React from 'react'

import Paper from '@mui/material/Paper'

import { EditableTitle } from '../common/EditableTitle'

export const TaskTitle = ({ 
	title,
	upsertTask
}) => {
	return (
		<Paper
			style={{ margin: 5 }}
			elevation={6}
		>
			<EditableTitle
				fullWidth
				title={title}
				onEdit={newTitle => upsertTask({ title: newTitle })}
			/>
		</Paper>
	)
}
