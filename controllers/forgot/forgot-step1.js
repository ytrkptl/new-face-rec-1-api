const redisClient = require('../signin').redisClient;
const handleSendingEmail = require('../send-email-forgot').handleSendingEmail;

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value, 'EX', 3600))

const getToken = (key) => redisClient.get(key, function (error, result) {
  if (error) {
    console.log(error);
    throw error;
  }
  console.log(result)
  return result;
});

// the function below will output all keys from redis that match the argument 'key',
// whose default value is '*', which return all keys from redis
const viewAll = (key='*')=> redisClient.keys(key, function (error, result) {
  if (error) {
    console.log(error);
    throw error;
  }
  console.log(result)
  return result;
});

// the function below will remove all data from redis database
const flushAllFromRedis = () => redisClient.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
        setToken(yourEmail, randomId)
        .then(check=>{
          console.log('check = ' + check)
          if (check===true) {
            handleSendingEmail(randomId, req, res)
          } else {
            console.log('noooo')
            throw new Error
          }
        })
        .catch(err=>{
          console.log('Something went wrong in step 1 ' + err)
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