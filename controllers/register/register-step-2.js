const jwt = require('../signin').jwt;
const redisHelper = require('../../utils/redis-helper');

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '2 days'});
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return redisHelper.setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token, user }
    })
    .catch(err=>console.log(err));
};

const handleRegister = (db, bcrypt, req, res) => {

  const { confirmationId } = req.body;
  let uniqueKey = confirmationId + ' ';
  
  return redisHelper.getMultipleValues(uniqueKey + 'randomId', uniqueKey + 'name', uniqueKey + 'email', uniqueKey + 'password')
  .then(values=>{
    let randomId = values[0].slice(0,37)
    let name = values[1]
    let email = values[2]
    let hash = values[3]
    if(randomId===confirmationId) {
      return db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => user[0])
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err =>err)
    }
  })
  .catch(err=>err) 
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisHelper.getToken(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized');
    }
    return res.json({id: reply})
  });
}

const registerAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res)
    : handleRegister(db, bcrypt, req, res)
    .then(data =>
      data.id && data.email ? createSession(data) : Promise.reject(data))
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err));
}

module.exports = {
  registerAuthentication: registerAuthentication,
}