const config = require('./config')
const { Pool, Client } = require('pg')
const app = require('express')()
const bodyParser = require('body-parser');
const cors = require('cors')
const client = new Client(config.postgres)
const users = require('./users/routes')
const usersMiddelware = require('./users/middlerware')
const votes = require('./votes/routes')
const cookieParser = require('cookie-parser')


client.connect().catch(console.log)

app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser())
app.use('/users', users(client))
app.use('/votes', votes(client, usersMiddelware(client)))

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})



function logInternalError(req,res,next) {
    
}