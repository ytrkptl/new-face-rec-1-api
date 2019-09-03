const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const signout = require('./controllers/signout');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// for using locally and connecting to pgAdmin
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

const whitelist = [
  'http://localhost:3001',
  '/\.facerecognition1-api.herokuapp\.com$/',
  '/\.new-face-rec-1.herokuapp\.com$/'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(morgan('combined'));
app.use(cors(corsOptions))
app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => { res.send('It is working! ') })
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', register.registerAuthentication(db, bcrypt))
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put(('/image'), auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })
app.delete('/signout', (req, res) => {signout.removeAuthToken(req, res)})
app.listen(process.env.PORT, () => console.log(`app is running on port ${process.env.PORT}`))