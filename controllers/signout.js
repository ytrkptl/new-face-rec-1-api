const redisHelper = require('../utils/redis-helper');

const removeAuthToken = (req, res) => {
  const { authorization } = req.headers;
  if (authorization){
    return redisHelper.deleteToken('token')
            .then(response=> res.status(200).json(response))
  }
  return res.status(400).json('No users are logged in.')
}

module.exports = {
  removeAuthToken: removeAuthToken
}