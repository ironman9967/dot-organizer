
import React from 'react'

import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

export const DayOfWeekHeader = ({ title }) => {
	return (
		<Paper
			style={{ margin: 10 }}
			elevation={6}
		>
			<TextField
				fullWidth
				defaultValue={title}
				InputProps={{ readOnly: true }}
			/>
		</Paper>
	)
}
