const redisHelper = require('../../utils/redis-helper');
const handleSendingEmailConfirmation = require('../send-email-confirmation').handleSendingEmailConfirmation;

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


/* This method checks to see if name, email, and password are provided first, then it
checks to see if that email exists in database. If yes, sends the user
an email with a confirmationId and a success status of 200. If no, sends the users
no emails but still with a success status of 200. This will keep anyone from 
figuring out what emails exist in our database */
const handleRegisterWithEmail = async (db, bcrypt, req, res) => {
  
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
     return res.status(400).json('Please fill out a valid form')
  }
  
  db.select('id', 'email').from('users')
    .where({'email': email})
    .then(user => {
      if (user[0]===undefined) {
        const randomId = uuidv4();
        let passwordEnc = bcrypt.hashSync(password, 10);
        let someKeys = ['randomId', 'name', email, 'password', 'email']
        let someVals = [randomId, name, email, passwordEnc, email] 
        redisHelper.keyExists(email)
        .then(x=>{
          if(x===0) {
            // register only if key does not exist 
            redisHelper.setMultipleValuesWithEx(someKeys, someVals)
            .then(check=>{
              if (check===true) {
                handleSendingEmailConfirmation(randomId, req, res)
              } else {
                Promise.reject('noooo error').catch(err=>err)
              }
            })
            .catch(err=>{
              Promise.reject('key already exists').catch(err=>err)
            })
          } 
          else {
            Promise.reject('key already exists').catch(err=>err)
          }
        })
        .catch(err=> {
          return res.status(400).json('An email with confirmation code has already been sent to this email address.')
        })
        return res.status(200).json('Please check your email and enter the code provided in the box below')
      }
      else {
        return res.status(200).json('Please check your email and enter the code provided in the box below')
      }
    })
    .catch(err => {
      return res.status(200).json(`Please check your email and enter the code provided in the box below `)
    })
}

module.exports = {
  handleRegisterWithEmail: handleRegisterWithEmail,
}