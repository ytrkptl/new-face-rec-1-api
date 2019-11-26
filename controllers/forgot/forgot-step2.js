const redisHelper = require('../../utils/redis-helper');

/*This step gets called during step 2 of forgot password request
It check whether the yourEmail exists in redis? If yes,
then it checks to see if the resetId matches or not
and responsds accordingly.*/
const handleResetId = (req, res) => {
  
  const { resetId, yourEmail } = req.body;
  
  redisHelper.keyExists(yourEmail)
  .then(ans=>{
    redisHelper.getToken(yourEmail)
    .then(x=>{
      if (x===resetId) {
        return res.status(200).json('Reset Id matches')
      } 
      else {
        return res.status(400).json('Reset v Id did not match')
      }
    })
    .catch(err=>{
      return res.status(400).json('Reset d Id did not match')
    })
  }).catch(bad=>{
    return res.status(400).json('Reset ddId did not match')
  })
}

module.exports = {
  handleResetId: handleResetId
}