
import * as path from 'path'

import { v4 as uuid } from 'uuid'
import { createSubject } from 'subject-with-filter'
import * as Hapi from '@hapi/hapi'
import * as Inert from '@hapi/inert'
import { Server as socketIOServer } from 'socket.io'

import { createClient } from '@redis/client'

import { createDatasource } from './datasource'
import { createEngine } from './engine'
import { createServer } from './server'

const datasource = createDatasource({ 
	uuid, 
	createClient,
	url: process.env.REDIS_URL || 'redis://localhost:6379'
})

const { startEngine, stopEngine } = createEngine({
	createSubject,
	datasource
})

const { startServer, stopServer } = createServer({
	path,
	Hapi,
	Inert,
	socketIOServer,
	port: process.env.PORT || 8080
})

const init = async () => {
	console.log('starting...')
	const engine = await startEngine()
	const server = await startServer({ engine })
	console.log('started')

	console.log(server)
}

init()
