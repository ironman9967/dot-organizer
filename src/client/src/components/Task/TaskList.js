
import { useCallback, useState, useEffect } from 'react'

import Paper from '@mui/material/Paper'

import AddCircleIcon from '@mui/icons-material/AddCircle'

import { TaskRow } from './TaskRow'

export const TaskList = ({ 
	size, 
	data: { tasks, assignments },
	removeTask,
	upsertTask
}) => {
	const [ tempTasks, setTempTasks ] = useState()
	const testCb = useCallback(({ dragTask, dropTask }) => {
		const reordered = tempTasks.map(task => {
			if (dropTask._key === task._key) {

				console.log('setting drop order', { dropTask, dragTask, task, change: {
					...task,
					order: dragTask.order
				} })
	
				return {
					...task,
					order: dragTask.order
				}
			}
			if (dragTask._key === task._key) {

				console.log('setting drag order', { dropTask, dragTask, task, change: {
					...task,
					order: dropTask.order
				} })
	
				return {
					...task,
					order: dropTask.order
				}
			}

			console.log('no change', { dropTask, dragTask, task })

			return task
		})

		console.log({ reordered })

		setTempTasks(reordered)
	}, [ tempTasks, setTempTasks ])
	useEffect(
		() => tempTasks ? void 0 : setTempTasks(tasks), 
		[ tasks, tempTasks, setTempTasks ]
	)
	if (!tempTasks) return
	const removeThisTask = _key => () => removeTask(_key)
	const upsertThisTask = task => taskUpdates => 
		upsertTask({
			...task,
			...taskUpdates,
			_key: task._key
		})
	return (
		<Paper
			style={{
				padding: 5,
				margin: 5
			}}
			elevation={24}
		>	
			{tempTasks
				.sort((
					{ order: order1 }, 
					{ order: order2 }
				) => order1 - order2)
				.map(task => (
					<Paper
						style={{ 
							padding: 5,
							margin: 5
						}}
						key={task._key}
						elevation={6}
					>
						<TaskRow 
							size={size} 
							task={task} 
							assignments={assignments}
							removeTask={removeThisTask(task._key)}
							upsertTask={upsertThisTask(task)}
							testCb={testCb}
						/>
					</Paper>
				))
			}
			<AddCircleIcon 
				style={{
					padding: 5,
					margin: 5,
					fontSize: size
				}}
				onClick={() => upsertTask({
					title: 'New Task',
					color: `#${Math.ceil(Math.random() * 0x1000000).toString(16)}`,
					timesPerWeek: 0
				})}
			/>
		</Paper>
	)
}
