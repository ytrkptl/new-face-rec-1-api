if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Redis Setup
const redis = require('redis');

// You will want to update your host to the proper address in production
const redisClient = redis.createClient(process.env.REDIS_URL);

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const getToken = key => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, function(error, result) {
      if (error) {
        reject()
      }
      resolve(result)
    })
  }).catch(err=>console.log(err + ' from redisHelper.js line 19'))
}

const deleteToken = (key) => Promise.resolve(redisClient.del(key));

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

// the function below will output all keys from redis that match the argument 'key',
// whose default value is '*', which return all keys from redis
const viewAll = (key='*')=> redisClient.keys(key, function (error, result) {
  if (error) {
    throw error;
  }
  return result;
});

// the function below will remove all data from redis database
const flushAllFromRedis = () => redisClient.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});

const getMultipleValues = (key1, key2, key3, key4) => {
  return new Promise((resolve, reject) => {
    redisClient.mget(key1, key2, key3, key4, function (error, result) {
    if (error) {
      reject(error);
    }
    resolve(result);
  })
})}

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

module.exports = {
  redisClient,
  getToken,
  setToken,
  deleteToken,
  keyExists,
  getMultipleValues,
  setMultipleValuesWithEx,
  viewAll,
  flushAllFromRedis
}