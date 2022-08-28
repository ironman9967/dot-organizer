
import * as path from 'path'

import { v4 as uuid } from 'uuid'
import { createSubject } from 'subject-with-filter'
import * as Hapi from '@hapi/hapi'
import * as Inert from '@hapi/inert'
import { Server as socketIOServer } from 'socket.io'

import { createClient } from '@redis/client'

import { createDatasource } from './datasource'
import { createServer } from './server'

const datasource = createDatasource({ 
	uuid, 
	createSubject,
	createClient,
	url: process.env.REDIS_URL || 'redis://localhost:6379'
})

const { startServer } = createServer({
	path,
	Hapi,
	Inert,
	socketIOServer,
	port: process.env.PORT || 8080
})

const init = async () => {
	console.log('starting...')
	await datasource.connect()
	const server = await startServer({ datasource })
	console.log('started')

	console.log(server)
}

init()
