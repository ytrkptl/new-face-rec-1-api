const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

// comes with Express.
const path = require('path');

const registerStepOne = require('./controllers/register/register-step-1');
const registerStepTwo = require('./controllers/register/register-step-2');
const signin = require('./controllers/signin');
const forgot = require('./controllers/forgot/forgot-step1');
const reset = require('./controllers/forgot/forgot-step2');
const updateNewPassword = require('./controllers/forgot/forgot-step3');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const signout = require('./controllers/signout');

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

const app = express();

app.use(morgan('combined'));
app.use(cors('*'))
app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register-step-1', (req, res) => registerStepOne.handleRegisterWithEmail(db, bcrypt, req, res))
app.post('/register-step-2', registerStepTwo.registerAuthentication(db, bcrypt))
app.post('/forgot', (req, res) => { forgot.handleForgotPassword(db, req, res) })
app.post('/reset', (req, res) => { reset.handleResetId(req, res) })
app.post('/update-new-password', (req, res) => { updateNewPassword.handleUpdateNewPassword(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.post('/upload/:id', auth.requireAuth, (req, res) => { profile.handleProfilePhoto(req, res, db)})
app.put(('/image'), auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })
app.delete('/signout', (req, res) => {signout.removeAuthToken(req, res)})
app.listen(process.env.PORT, () => console.log(`app is running on port ${process.env.PORT}`))