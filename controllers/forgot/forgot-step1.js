const redisHelper = require('../../utils/redis-helper');
const handleSendingEmail = require('../send-email-forgot').handleSendingEmail;

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/* This method checks to see if yourEmail was provided first, then it
checks to see if that email exists in database. If yes, sends the user
an email with a resetId and a success status of 200. If no, sends the users
no emails but still with a success status of 200. This will keep anyone from 
figuring out what emails exist in our database */

const handleForgotPassword = async (db, req, res) => {

  const { yourEmail } = req.body;

  if (!yourEmail) {
     return Promise.reject('Please fill out a valid email address.');
  }
  
  db.select('id', 'email').from('users')
    .where({'email': yourEmail})
    .then(user => {
      if (user[0].id) {
        const randomId = uuidv4();
        redisHelper.setToken(yourEmail, randomId)
        .then(check=>{
          if (check===true) {
            handleSendingEmail(randomId, req, res)
          } else {
            throw new Error
          }
        })
        .catch(err=>{
          console.log('Something went wrong in step forgot step 1 ' + err)
        })
        return res.status(200).json('Please check your email and enter the code provided in the box below')
      }
    })
    .catch(err => {
      return res.status(200).json(`Please check your email and enter the code provided in the box below`)
    })
}

module.exports = {
  handleForgotPassword: handleForgotPassword
}