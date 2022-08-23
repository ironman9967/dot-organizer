
import React from 'react'

import Paper from '@mui/material/Paper'

import { EditableTitle } from '../common/EditableTitle'

export const TaskTitle = ({ 
	size,
	title,
	removeTask,
	upsertTask,
}) => {
	return (
		<Paper
			style={{ margin: 5, paddingLeft: 0, marginTop: 24 }}
			elevation={6}
		>
			<EditableTitle
				fullWidth
				size={size}
				title={title}
				onEdit={newTitle => upsertTask({ title: newTitle })}
				onClick={() => removeTask()}
			/>
		</Paper>
	)
}
