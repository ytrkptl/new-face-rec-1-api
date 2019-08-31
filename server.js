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

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : process.env.POSTGRES_USER,
    password : process.env.POSTGRES_PASSWORD,
    database : 'facerecognitiondb'
  }
});

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send('It is working! ') })
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', register.registerAuthentication(db, bcrypt))
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put(('/image'), auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })
app.delete('/signout', (req, res) => {signout.removeAuthToken(req, res)})
app.listen(process.env.PORT || 3000, () => console.log(`app is running on port ${process.env.PORT}`))