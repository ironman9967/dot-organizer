
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'

import Grid from '@mui/material/Grid'

import { TaskDot } from './TaskDot'
import { TaskTitle } from './TaskTitle'
import { TaskPerWeekList } from './TaskPerWeekList'

export const TaskRow = ({ 
	size, 
	task, 
	assignments,
	removeTask,
	upsertTask,
	testCb
}) => {
	const [, dragRef] = useDrag(() => ({
		type: 'task-reorder',
		item: task,
		end: task => console.log({ toTask: task, task })
	}))
	const [, dropRef] = useDrop({
        accept: 'task-reorder',
		hover: dragTask => {
			if (dragTask._key !== task._key) {
				testCb({ dragTask, dropTask: task })
			}

			// if (dragTask._key !== task._key
			// 	&& (!reorder
			// 		|| reorder.dragTask._key !== dragTask._key
			// 		|| reorder.dropTask._key !== task._key)
			// ) {
			// 	console.log('setReorder', { dragTask, dropTask: task, reorder })
			// 	setReorder({ dragTask, dropTask: task })
			// }
		}
    })
	return (
		<Grid 
			container 
			spacing={2}
			columnSpacing={1}
			rowSpacing={1}
			direction="row"
			alignItems="center"
			ref={node => dragRef(dropRef(node))}
		>
			<Grid 
				item
				xs={1}
			>
				<TaskDot
					size={size}
					color={task.color}
					upsertTask={upsertTask}
				/>
			</Grid>
			<Grid 
				item
				xs={3}
			>
				<TaskTitle 
					size={size}
					title={task.title}
					removeTask={removeTask}
					upsertTask={upsertTask}
				/>
			</Grid>
			<Grid 
				item
				xs={8}
			>
				<TaskPerWeekList 
					size={size}
					color={task.color}
					task={task}
					timesPerWeek={task.timesPerWeek}
					assigned={
						assignments.filter(({ 
							taskKey
						}) => taskKey === task._key).length
					}
					upsertTask={upsertTask}
				/>
			</Grid>
		</Grid>
	)
}
