const config = require('./config')
const { Pool, Client } = require('pg')
const fs = require('fs');
const app = require('express')()
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors')
const client = new Client(config.postgres)
const users = require('./users/routes')
const usersMiddelware = require('./users/middlerware')
const votes = require('./votes/routes')
const cookieParser = require('cookie-parser')
const admin = require('./admin/routes')

client.connect().catch(console.log)

app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser())
app.use('/judgit', admin())
app.use('/users', users(client))
app.use('/votes', votes(client, usersMiddelware(client)))


if (process.env.node_env == "prod") {
    console.log('this is prod');
    
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/judgit.site/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/judgit.site/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/judgit.site/chain.pem', 'utf8');
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    }); 
}

let port = process.env.node_port ? process.env.node_port : config.defaultPort

app.listen(port, function () {
    console.log('judgit server listening on port ' + port)
})

function logInternalError(req,res,next) {
    
}
