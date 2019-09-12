const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if(user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
  .catch(err => res.status(400).json('error getting user'))
}

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db('users')
    .where({ id })
    .update({ name, age, pet })
    .then(resp => {
      if(resp) {
        res.json("success")
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json('Error updating user'))
}

const handleProfileUpdateWithPhoto = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet, photourl } = req.body.formInput;

  if (photourl === '' || photourl === undefined) {
    console.log(photourl)
    return db('users')
    .where({ id })
    .update({ name, age, pet })
    .then(resp => {
      if(resp) {
        res.json("success")
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json('Error updating user'))
  }
  return db('users')
    .where({ id })
    .update({ name, age, pet, photourl })
    .then(resp => {
      if(resp) {
        res.json("success")
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json('Error updating user'))
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  handleProfileUpdateWithPhoto
}