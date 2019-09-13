const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

// comes with Express.
const path = require('path');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const signout = require('./controllers/signout');
const Airtable = require('airtable');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// for using locally and connecting to pgAdmin as well
// as for making calls to heroku postgres from server
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

let base = new Airtable({apiKey: `${process.env.AIRTABLE_API_KEY}`}).base(`${process.env.AIRTABLE_BASE}`);
const app = express();

app.use(morgan('combined'));
app.use(cors())
app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', register.registerAuthentication(db, bcrypt))
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.post('/upload/:id', auth.requireAuth, (req, res) => { profile.handleProfilePhoto(req, res, db)})
app.put(('/image'), auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })
app.delete('/signout', (req, res) => {signout.removeAuthToken(req, res)})
app.listen(process.env.PORT, () => console.log(`app is running on port ${process.env.PORT}`))