const redisHelper = require('../utils/redis-helper').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).json('Unauthorized');
  }
 
  return new Promise((resolve, reject) => {
    
    redisHelper.get(authorization, function(error, result) {
      if (error || !result) {
        reject(res.status(401).json('Unauthorized'))
      }
      resolve(next())
    })
  }).catch(err=>console.log(err + ' in authorization.js'))
}

module.exports = {
  requireAuth: requireAuth
}