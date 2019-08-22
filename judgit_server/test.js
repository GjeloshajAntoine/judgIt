const { Pool, Client } = require('pg')
const config = require('./config')
const app = require('express')()
const bodyParser = require('body-parser');
const cors = require('cors')
const users = require('./users/routes')

require('chai').should()

const client = new Client(config.postgres)
client.connect().catch(console.log)


require('./users/test')(client)