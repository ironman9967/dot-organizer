
import './App.css'

import { useEffect, useState } from 'react'

import io from 'socket.io-client'

import { TaskList } from './components/Task/TaskList.js'

const socket = io({ path: '/socket' })

// const removeTimeslot = order => socket.emit('remove-timeslot', order)
// const upsertTimeslot = timeslot => socket.emit('upsert-timeslot', timeslot)
// const removeTask = title => socket.emit('remove-task', title)
const upsertTask = task => socket.emit('upsert-task', task)
// const removeAssignment = assignmentToRemove => 
// 	socket.emit('remove-assignment', assignmentToRemove)
// const upsertAssignment = newAssignment => 
// 	socket.emit('upsert-assignment', newAssignment)

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
			<TaskList 
				size={50}
				data={data}
				upsertTask={upsertTask}
			/>
		</div>
	)
}

export default App
