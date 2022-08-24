
import { useState } from 'react'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

export const EditableTitle = ({ 
	size,
	title,
	onEdit,
	onClick,
	...props
}) => {
	const [ editedTitle, setEditedTitle ] = useState(title)
	return (
		<Grid
			container 
			spacing={2}
			direction="row"
			justifyContent="right"
			alignItems="center"
		>
			<Grid 
				style={{ paddingTop: 0 }}
				item
				xs={9}
			>
				<TextField
					{ ...props }
					defaultValue={title}
					onChange={({ target: { value } }) => setEditedTitle(value)}
					onBlur={() => title !== editedTitle
						? onEdit(editedTitle)
						: void 0
					}
				/>
			</Grid>
			<Grid 
				style={{ paddingTop: 0, paddingRight: 16 }}
				item
				xs={3}
			>
				<IconButton
					onClick={onClick}
				>
					<DeleteTwoToneIcon
						style={{ fontSize: size * 0.75 }}
					/>
				</IconButton>
			</Grid>
		</Grid>
	)
}
