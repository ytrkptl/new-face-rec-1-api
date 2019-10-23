const redisClient = require('../signin').redisClient;

// this will check if the provided key already exists
const keyExists = (key) => {
  return new Promise((resolve, reject) => {
    const a = redisClient.exists(key)
    if(a) {
      resolve(true)
    }
    else {
      reject(false)
    }
  })
}

const getToken = key => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, function(error, result) {
      if (error) {
        reject()
      }
      resolve(result)
    })
  }).catch(err=>console.log(err + 'tohererere'))
}


const handleResetId = (req, res) => {
  // let reallyRandomId = uuidv4();
  // console.log(reallyRandomId);
  const { resetId, yourEmail } = req.body;
  
  keyExists(yourEmail)
  .then(ans=>{
    getToken(yourEmail)
    .then(x=>{
      if (x===resetId) {
        return res.status(200).json('Reset Id matches')
      } 
      else {
        return res.status(400).json('Reset Id did not match')
      }
    })
    .catch(err=>{
      return res.status(400).json('Reset Id did not match')
    })
  }).catch(bad=>{
    return res.status(400).json('Reset Id did not match')
  })
}

module.exports = {
  handleResetId: handleResetId
}