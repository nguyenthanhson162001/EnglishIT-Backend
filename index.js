const os = require("os");
const hostname = os.hostname();
const express = require('express');
const app = express();
const morgan = require('morgan') // show log
const routes = require('./routes');
const cors = require('cors')
const port = 443;
const https = require('https')
const fs = require('fs')
const path = require('path')
const { auth, requiresAuth } = require('express-openid-connect');
const createOrUpdateUser = require('./util/createOrUpdateUser')


require('./config/mysql')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencode
app.use(morgan('tiny'))


// https congfig


const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app)
// socket config 
const io = require('socket.io')(sslServer, {
    cors: {
        methods: ["GET", "POST"]
    }
});
require('./config/socket/exam')(io)


// origin: process.env.URL_CLIENT,
var corsOptions = {
    origin: 'https://*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204

}
app.use(cors(corsOptions))

app.use(express.static('public'));

console.log(hostname)
const configAuth0 = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'https://' + hostname,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: 'https://' + process.env.AUTH0_DOMAIN,
    secret: process.env.CLIENT_SECRET,
};


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(configAuth0));
// midderware create or update user every login
app.post('/callback', (req, res, next) => {
    createOrUpdateUser(req.oidc.user)
    next();
})
routes(app)

sslServer.listen(port, () => console.log(`server run with https://${os.hostname()}:${port}`));


// const xlsxFile = require('read-excel-file/node');

// xlsxFile('./unti1_unit2.xlsx').then((rows) => {
//     rows.map((row) => {

//         Vocabulary.create({
//             english: row[0],
//             vietnamese: row[1],
//             spelling: row[2],
//             unit_id: row[3],
//             typeVocabulary_id: row[4]
//         })
//     })
// })