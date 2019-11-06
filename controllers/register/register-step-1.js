const redisClient = require('../signin').redisClient;
const handleSendingEmailConfirmation = require('../send-email-confirmation').handleSendingEmailConfirmation;
// const viewAll = require('../forgot/forgot-step1').viewAll;

const setMultipleValues = (key1, val1, key2, val2, key3, val3, key4, val4) => Promise.resolve(redisClient.mset(key1, val1, key2, val2, key3, val3, key4, val4, 'EX', 3600))

// this will check if the provided key already exists
const keyExists = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.exists(key, function (error, result) {
    if (error) {
      reject(error)
    }
    resolve(result)
    });
  })
}

const setMultipleValuesWithEx = (someKeys, someVals) => {
  return new Promise((resolve, reject) => {
    // add randomId to each key to make it a uniquekey
    let uniqueKey = someVals[0] + ' ';
    let a = redisClient.multi();
    // a.get()
    for(let i = 0; i< someKeys.length; i++) {
      if(i===2) {
        a.set(someKeys[i], someVals[i])
        a.expire(someKeys[i], 3600)
      } else {
        a.set(uniqueKey + someKeys[i], someVals[i])
        a.expire(uniqueKey + someKeys[i], 3600)
      }
    }
    
    a.exec();

    if (resolve) {
      resolve(true)
    } else if (reject) {
      reject(false)
    }
  })
}

const getMultipleValuesWithEx = (someKeys) => {
  return new Promise((resolve, reject) => {
    // add randomId to each key to make it a uniquekey
    let uniqueKey = someKeys[2] + ' ';
    let a = redisClient.multi();
    for(let i = 0; i< someKeys.length; i++) {
      if(i===2) {
        getToken(someKeys[i])
      } else {
        getToken(uniqueKey + someKeys[i])
      }
    }
    
    a.exec();

    if (resolve) {
      Promise.resolve(true)
    } else if (reject) {
      Promise.reject(false)
    }
  })
}

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const viewAll = (key='*')=> redisClient.keys(key, function (error, result) {
  if (error) {
    throw error;
  }
  return result;
});

const getToken = (key) => redisClient.mget(key, function (error, result) {
  if (error) {
    throw error;
  }
  return result;
});

// the function below will remove all data from redis database
const flushAllFromRedis = () => redisClient.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});

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
          keyExists(email)
          .then(x=>{
            if(x===0) {
              // if key does not exists 
              setMultipleValuesWithEx(someKeys, someVals)
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