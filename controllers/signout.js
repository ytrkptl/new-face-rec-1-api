const redisClient = require('./signin').redisClient;

const deleteToken = (key) => Promise.resolve(redisClient.del(key));

const removeAuthToken = (req, res) => {
  const { authorization } = req.headers;
  if (authorization){
    return deleteToken('token')
            .then(response=> res.status(200).json(response))
  }
  return res.status(400).json('No users are logged in.')
}

module.exports = {
  removeAuthToken: removeAuthToken
}