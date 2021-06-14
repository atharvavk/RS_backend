const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const session = require('express-session');
require('dotenv/config');

//HTTPS
var https = require('https');
var privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };

//ROUTES
const copyRoute = require('./routes/copy');
const mkdirRoute = require('./routes/createNewFolder');
const downloadRoute = require('./routes/download');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const storageRoute = require('./routes/storage');
const uploadRoute = require('./routes/upload');
const moveRoute = require('./routes/move');
const toggleSharingRoute = require('./routes/toggleSharing');
const deleteRoute = require('./routes/delete');

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000, () => console.log('Listening on port 3000'));
//MIDDLEWARE for ROUTES
app.use(
  session({
    secret: 'my session',
    cookie: {
      sameSite: 'none',
      secure: true,
    },
  }),
);
app.use(bodyParser.json());
app.use('/register', registerRoute);
app.use('/storage', storageRoute);
app.use('/login', loginRoute);
app.use('/upload', uploadRoute);
app.use('/download', downloadRoute);
app.use('/mkdir', mkdirRoute);
app.use('/copy', copyRoute);
app.use('/move', moveRoute);
app.use('/toggleSharing', toggleSharingRoute);
app.use('/delete', deleteRoute);

//DATABASE connection for MongoDB
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('db connected');
  },
);
