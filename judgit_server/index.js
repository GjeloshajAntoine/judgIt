import config from './config';
const { Pool, Client } = require('pg')
let app = require('express').express();
let votes = require('./votes/routes')

const client = new Client(config.postgres)
client.connect()
app.use('/votes', votes(client))

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})