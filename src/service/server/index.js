
export const createServer = ({
	path,
	Hapi,
	Inert,
	socketIOServer,
	port
} = {}) => {
	const server = Hapi.server({ 
		port, 
		routes: {
			files: {
				relativeTo: path.join(__dirname, 'public')
			}
		}
	})
	const io = new socketIOServer(server.listener, {
		path: '/socket'
	})
	let unsubEngineUpdate = () => {}
	return {
		startServer: async ({ 
			engine: { 
				getData,
				onEngineUpdate, 
				upsertTimeslot,
				removeTimeslot,
				upsertTask,
				removeTask,
				upsertAssignment,
				removeAssignment
			}
		}) => {
			await server.start()
			await server.register(Inert)
			server.route({
				method: 'GET',
				path: '/{param*}',
				handler: {
					directory: {
						path: '.',
						listing: true,
						redirectToSlash: true
					}
				}
			})
			unsubEngineUpdate = 
				onEngineUpdate(({ data }) => io.emit('sync-data', data))
				.unsubscribe
			io.on('connection', socket => {
				socket.on('load-data', async () => 
					socket.emit('sync-data', await getData()))
				socket.on('upsert-timeslot', 
					async timeslot => await upsertTimeslot(timeslot))
				socket.on('remove-timeslot', 
					async order => await removeTimeslot(order))
				socket.on('upsert-task', 
					async task => await upsertTask(task))
				socket.on('remove-task', 
					async title => await removeTask(title))
				socket.on('upsert-assignment', 
					async assignment => await upsertAssignment(assignment))
				socket.on('remove-assignment', 
					async assignment => await removeAssignment(assignment))

				socket.once('disconnect', () => {
					console.log('disconnected', socket.id)
					socket.removeAllListeners('load-data')
					socket.removeAllListeners('upsert-timeslot')
					socket.removeAllListeners('remove-timeslot')
					socket.removeAllListeners('upsert-task')
					socket.removeAllListeners('remove-task')
					socket.removeAllListeners('upsert-assignment')
					socket.removeAllListeners('remove-assignment')
				})
			})
			return { 
				server: { uri: server.info.uri }
			}
		},
		stopServer: async () => {
			unsubEngineUpdate()
			server.stop({ timeout: 60 * 1000 })
		}
	}
}
