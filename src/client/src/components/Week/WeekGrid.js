
import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { DayOfWeekHeader } from './DayOfWeekHeader'
import { TimeslotTitle } from './TimeslotTitle'
import { TimeslotAssignmentList } from './TimeslotAssignmentList'

export const WeekGrid = ({ 
	size, 
	data: { tasks, timeslots, daysOfWeek, assignments },
	removeAssignment,
	upsertAssignment
}) => {
	if (!timeslots) return
	const headers = [ 'Timeslots', ...daysOfWeek.map(({ title }) => title) ]
	return (
		<Paper
			style={{ margin: 15 }}
			elevation={24}
		>
			<Grid
				container
				spacing={2}
				columnSpacing={1}
				rowSpacing={1}
				direction="row"
				justifyContent="center"
				alignItems="center"
			>{
				headers.map(title => (
					<DayOfWeekHeader key={title} margin={5} title={title} />
				))
			}
			</Grid>{
				timeslots
					.sort((
						{ order: order1 }, 
						{ order: order2 }
					) => order1 - order2)
					.map(timeslot => {
						const timeslotAssignments = ({ title }) =>
							assignments
								.reduce((tmAssigns, assignment) => {
									if (timeslot.begin === assignment.timeslotBegin
										&& assignment.dayOfWeekTitle === title
									) {
										tmAssigns.push({
											task: tasks.find(t => t.title === assignment.taskTitle),
											assignment
										})
									}
									return tmAssigns
								}, [])
								.sort((
									{ task: { order: order1 } }, 
									{ task: { order: order2 } }
								) => order1 - order2)
						const assignThisTimeslot = ({
							dayOfWeekTitle,
							taskTitle
						}) => upsertAssignment({
							dayOfWeekTitle,
							timeslotBegin: timeslot.begin,
							taskTitle
						})
						const unassignThisTimeslot = ({
							taskTitle
						}) => removeAssignment({
							timeslotBegin: timeslot.begin,
							taskTitle
						})
						return (
							<Grid
								container
								key={timeslot.title}
								spacing={2}
								columnSpacing={1}
								rowSpacing={1}
								direction="row"
								justifyContent="center"
								alignItems="center"
							>
								<Grid
									style={{ margin: 5 }}
									item
									xs={1}
								>
									<TimeslotTitle title={timeslot.title} />
								</Grid>{
									daysOfWeek.map(dayOfWeek => 
										<Grid
											style={{ margin: 5 }}
											item
											key={dayOfWeek.title}
											xs={1}
										>
											<TimeslotAssignmentList
												size={size}
												dayOfWeek={dayOfWeek}
												timeslotAssignments={timeslotAssignments(dayOfWeek)}
												unassignThisTimeslot={unassignThisTimeslot}
												assignThisTimeslot={assignThisTimeslot}
											/>
										</Grid>
									)
								}
							</Grid>
						)
					})
			}
		</Paper>
	)
}
