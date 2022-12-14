
import './App.css'

import { useEffect, useState } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import io from 'socket.io-client'

import { WeekGrid } from './components/week/WeekGrid.js'
import { TaskList } from './components/task/TaskList.js'

const socket = io({ path: '/socket' })

const removeTimeslot = order => socket.emit('remove-timeslot', order)
const upsertTimeslot = timeslot => socket.emit('upsert-timeslot', timeslot)
const removeTask = title => socket.emit('remove-task', title)
const upsertTask = task => socket.emit('upsert-task', task)
const removeAssignment = assignmentToRemove => 
	socket.emit('remove-assignment', assignmentToRemove)
const upsertAssignment = newAssignment => 
	socket.emit('upsert-assignment', newAssignment)

function App() {
	const [ isConnected, setIsConnected ] = useState(socket.connected)
	const [ data, setData ] = useState({})
	useEffect(() => {
		socket.on('sync-data', newData => {
			console.log(newData)
			setData(newData)
		})
		if (isConnected) {
			socket.emit('load-data')
		}
		socket.on('connect', () => setIsConnected(true))
		socket.on('disconnected', setIsConnected(false))
		return () => {
			socket.off('connect')
			socket.off('disconnect')
			socket.off('sync-data')
		}
	}, [ isConnected, data ])
	return (
		<div className="App">
			<DndProvider backend={HTML5Backend}>
				<WeekGrid
					size={50}
					data={data}
					removeTimeslot={removeTimeslot}
					upsertTimeslot={upsertTimeslot}
					removeAssignment={removeAssignment}
					upsertAssignment={upsertAssignment}
				/>
				<TaskList 
					size={50}
					data={data}
					removeTask={removeTask}
					upsertTask={upsertTask}
				/>
			</DndProvider>
		</div>
	)
}

export default App
