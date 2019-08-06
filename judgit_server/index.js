const config = require('./config')
const { Pool, Client } = require('pg')
let app = require('express')()
let votes = require('./votes/routes')
let bodyParser = require('body-parser');
let cors = require('cors')

const client = new Client(config.postgres)

client.connect().catch(console.log)

app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/votes', votes(client))

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})