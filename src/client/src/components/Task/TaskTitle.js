
import React from 'react'

export const TaskTitle = ({ title }) => {
	if (!title) return
	return (
		<div style={{ textAlign: 'left' }}>
			{title}
		</div>
	)
}
