
import { useState } from 'react'

import TextField from '@mui/material/TextField'

export const EditableTitle = ({ 
	title,
	onEdit,
	...props
}) => {
	const [ editedTitle, setEditedTitle ] = useState(title)
	return (
		<TextField	
			{ ...props }
			defaultValue={title}
			onChange={({ target: { value } }) => setEditedTitle(value)}
			onBlur={() => title !== editedTitle
				? onEdit(editedTitle)
				: void 0
			}
		/>
	)
}
