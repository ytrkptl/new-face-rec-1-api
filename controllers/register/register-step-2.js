const jwt = require('../signin').jwt;
const redisClient = require('../signin').redisClient;

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '2 days'});
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

// this will return a promise containing multiple keys and values in an array
const getMultipleValues = (key1, key2, key3, key4) => {
  return new Promise((resolve, reject) => {
    redisClient.mget(key1, key2, key3, key4, function (error, result) {
    if (error) {
      reject(error);
    }
    resolve(result);
  })
})}

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token, user }
    })
    .catch(err=>err);
};

const handleRegister = (db, bcrypt, req, res) => {

  const { confirmationId } = req.body;
  let uniqueKey = confirmationId + ' ';
  return getMultipleValues(uniqueKey + 'randomId', uniqueKey + 'name', uniqueKey + 'email', uniqueKey + 'password')
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
  return redisClient.get(authorization, (err, reply) => {
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
  redisClient: redisClient
}