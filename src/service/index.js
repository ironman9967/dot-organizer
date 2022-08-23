
import * as path from 'path'

import { v4 as uuid } from 'uuid'
import { createSubject } from 'subject-with-filter'
import * as Hapi from '@hapi/hapi'
import * as Inert from '@hapi/inert'
import { Server as socketIOServer } from 'socket.io'

import { createDatasource } from './datasource'
import { createEngine } from './engine'
import { createServer } from './server'

const datasource = createDatasource({ uuid })

const { startEngine, stopEngine } = createEngine({
	createSubject,
	datasource
})

const { startServer, stopServer } = createServer({
	path,
	Hapi,
	Inert,
	socketIOServer
})

const init = async () => {
	process.stdin.on('data', async input => {
		const [ command, ...args ] = input.toString().split(' ')
		switch (command.trim()) {
			case 'stop':
				console.log('stopping...')
				process.stdin.removeAllListeners()
				await stopServer()
				await stopEngine()
				console.log('stopped')
				process.exit(0)
			case 'output-data':
				console.log(JSON.stringify(await datasource.getData(), void 0, 2))
				break
		}
	})

	console.log('starting...')
	const engine = await startEngine()
	const server = await startServer({ engine })
	console.log('started')

	console.log(server)
}

init()
