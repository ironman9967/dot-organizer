
import React from 'react'
import { useDrop } from 'react-dnd'

import Paper from '@mui/material/Paper'

import { TimeslotAssignment } from './TimeslotAssignment'

export const TimeslotAssignmentList = ({ 
	size,
	dayOfWeek,
	timeslotAssignments,
	unassignThisTimeslot,
	assignThisTimeslot
}) => {
	const [{ isOver }, dropRef] = useDrop({
        accept: 'assign',
        drop: ({ task }) => assignThisTimeslot({
			dayOfWeekTitle: dayOfWeek.title,
			taskTitle: task.title
		}),
        collect: monitor => ({ isOver: monitor.isOver() })
    })
	return (
		<Paper
			style={{ 
				margin: 5,
				height: 75
			}}
			elevation={isOver ? 24 : 3}
			ref={dropRef}
		>{timeslotAssignments.length > 0 &&
			timeslotAssignments.map(({ task: { title, color } }) => (
				<TimeslotAssignment 
					key={title}
					size={size}
					color={color}
					taskTitle={title}
					unassignThisTimeslot={unassignThisTimeslot}
				/>
			))
		}</Paper>
	)
}
