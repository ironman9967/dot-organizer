
import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { DayOfWeekHeader } from './DayOfWeekHeader'
import { TimeslotTitle } from './TimeslotTitle'
import { TimeslotAssignmentList } from './TimeslotAssignmentList'

export const WeekGrid = ({ 
	size, 
	data: { tasks, timeslots, daysOfWeek, assignments },
	upsertTimeslot,
	removeAssignment,
	upsertAssignment
}) => {
	if (!timeslots) return
	const headers = [ 'Timeslots', ...daysOfWeek.map(({ title }) => title) ]
	const timeslotAssignments = ({ begin }) => ({ title }) => assignments
		.reduce((tmAssigns, assignment) => {
			if (begin === assignment.timeslotBegin
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
	const upsertThisTimeslot = timeslot => timeslotUpdates => 
		upsertTimeslot({
			...timeslot,
			...timeslotUpdates,
			_key: timeslot._key
		})
	const assignThisTimeslot = ({ begin }) => ({
		dayOfWeekTitle,
		taskTitle
	}) => upsertAssignment({
		dayOfWeekTitle,
		timeslotBegin: begin,
		taskTitle
	})
	const unassignThisTimeslot = ({ begin }) => ({
		taskTitle
	}) => removeAssignment({
		timeslotBegin: begin,
		taskTitle
	})
	return (
		<Paper
			style={{ 
				margin: 5,
				padding: 5
			}}
			elevation={24}
		>
			<Grid
				container
				spacing={2}
				columns={9}
				columnSpacing={1}
				rowSpacing={1}
				direction="row"
				alignItems="center"
			>{
				headers.map((title, i) => (
					<Grid
						key={title}
						item
						xs={i === 0 ? 2 : 1}
					>
						<DayOfWeekHeader 
							title={title}
						/>
					</Grid>
				))
			}
			</Grid>{
				timeslots
					.sort((
						{ order: order1 }, 
						{ order: order2 }
					) => order1 - order2)
					.map(timeslot => (
						<Grid
							container
							key={timeslot._key}
							spacing={2}
							columns={9}
							columnSpacing={1}
							rowSpacing={1}
							direction="row"
							alignItems="center"
						>
							<Grid
								item
								xs={2}
							>
								<TimeslotTitle 
									title={timeslot.title}
									upsertTimeslot={upsertThisTimeslot(timeslot)}
								/>
							</Grid>{
								daysOfWeek.map(dayOfWeek => 
									<Grid
										item
										key={dayOfWeek.title}
										xs={1}
									>
										<TimeslotAssignmentList
											size={size}
											dayOfWeek={dayOfWeek}
											timeslotAssignments={
												timeslotAssignments(timeslot)(dayOfWeek)
											}
											unassignTimeslot={
												unassignThisTimeslot(timeslot)
											}
											assignTimeslot={
												assignThisTimeslot(timeslot)
											}
										/>
									</Grid>
								)
							}
						</Grid>
					))
			}
		</Paper>
	)
}
