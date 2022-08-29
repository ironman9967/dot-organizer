
import React from 'react'
import { useDrop } from 'react-dnd'

import Paper from '@mui/material/Paper'

import { TimeslotAssignment } from './TimeslotAssignment'

export const TimeslotAssignmentList = ({ 
	size,
	timeslot,
	dayOfWeek,
	timeslotAssignments,
	removeAssignment,
	upsertAssignment
}) => {
	const [{ isOver }, dropRef] = useDrop({
        accept: 'assign',
        drop: assignment => {
			if (assignment.dayOfWeekTitle) {
				removeAssignment(assignment)
			}
			upsertAssignment({
				dayOfWeekTitle: dayOfWeek.title,
				timeslotKey: timeslot._key,
				taskKey: assignment.taskKey
			})
		},
        collect: monitor => ({ isOver: monitor.isOver() })
    })
	return (
		<Paper
			style={{ 
				margin: 10,
				minHeight: 100,
				display: 'flex', 
				flexFlow: 'row wrap',
				justifyContent: 'space-evenly'
			}}
			ref={dropRef}
			elevation={isOver ? 24 : 3}
		>{timeslotAssignments.length > 0 &&
			timeslotAssignments.map(({ task, assignment }) => (
				<TimeslotAssignment
					key={JSON.stringify(assignment)}
					size={size}
					task={task}
					assignment={assignment}
					removeAssignment={removeAssignment}
				/>
			))
		}</Paper>
	)
}
