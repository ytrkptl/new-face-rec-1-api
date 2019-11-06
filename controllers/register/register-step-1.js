const redisClient = require('../signin').redisClient;
const handleSendingEmailConfirmation = require('../send-email-confirmation').handleSendingEmailConfirmation;
// const viewAll = require('../forgot/forgot-step1').viewAll;

const setMultipleValues = (key1, val1, key2, val2, key3, val3, key4, val4) => Promise.resolve(redisClient.mset(key1, val1, key2, val2, key3, val3, key4, val4, 'EX', 3600))

// this will check if the provided key already exists
const keyExists = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.exists(key, function (error, result) {
    if (error) {
      console.log(error + 'bbbaaaa');
      reject(error)
    }
    console.log(result + 'boooo')
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
      console.log('resolved')
      resolve(true)
    } else if (reject) {
      console.log('rejected')
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
      console.log('resolved')
      Promise.resolve(true)
    } else if (reject) {
      console.log('rejected')
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
    console.log(error);
    throw error;
  }
  console.log(result)
  return result;
});

const getToken = (key) => redisClient.mget(key, function (error, result) {
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

const handleRegisterWithEmail = async (db, bcrypt, req, res) => {

	// flushAllFromRedis()
	// viewAll()

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
     return res.status(400).json('Please fill out a valid form')
  }
  // viewAll();
  db.select('id', 'email').from('users')
    .where({'email': email})
    .then(user => {
    	console.log('user is ' + user[0])
      if (user[0]===undefined) {
          const randomId = uuidv4();
          let passwordEnc = bcrypt.hashSync(password, 10);
          let someKeys = ['randomId', 'name', email, 'password', 'email']
          let someVals = [randomId, name, email, passwordEnc, email] 
          keyExists(email)
          .then(x=>{
            if(x===0) {
              console.log('dasreadched here')
              // if key does not exists 
              setMultipleValuesWithEx(someKeys, someVals)
              .then(check=>{
                console.log('check = ' + check)
                if (check===true) {
                  console.log('send email')
                  handleSendingEmailConfirmation(randomId, req, res)
                } else {
                  console.log('noooo error')
                  Promise.reject('noooo error')
                }
              })
              .catch(err=>{
                console.log('Something went wrong in step 1 ' + err)
              })
            } 
            else {
              console.log(x + ' viewing all')
              viewAll()
              Promise.reject('key already exists').catch(()=>console.log('key exists'))
            }
          })
          .catch(err=> {
            console.log(err + 'erraaarr')
            viewAll()
            return res.status(400).json('An email with confirmation code has already been sent to this email address.')
          })
          viewAll()
        return res.status(200).json('1Please check your email and enter the code provided in the box below')
      }
      else {
        viewAll()
        return res.status(200).json('2Please check your email and enter the code provided in the box below')
      }
    })
    .catch(err => {
    	console.log(err + 'errrqur')
      viewAll()
      return res.status(200).json(`3Please dsfadf check your email and enter the code provided in the box below`)
    })
}

module.exports = {
  handleRegisterWithEmail: handleRegisterWithEmail,
}