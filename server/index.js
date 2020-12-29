require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const treasureCtrl = require('./controllers/treasureController');
const authCtrl = require('./controllers/authController');
const auth = require('./middlewares/authMiddleware');
const app = express();
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

massive({
   connectionString: CONNECTION_STRING,
   ssl: {
      rejectUnauthorized: false
   }
}).then(db => {
   app.set('db', db);
   console.log('Database connected')
}).catch(err => console.log(err))

app.use(session({
   resave: true,
   saveUninitialized: false,
   secret: SESSION_SECRET
}));

app.post('/auth/register', authCtrl.register);
app.post('auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);


app.listen(SERVER_PORT, () => console.log(`Server listening on ${SERVER_PORT}`));