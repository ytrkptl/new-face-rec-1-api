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

const handleProfilePhoto = (req, res, db) => {
  const { id } = req.params;
  const { handle } = req.body;
  db('users')
    .where({ id })
    .update({ handle })
    .then(resp => {
      if(resp) {
        res.json("success inserted handle in db")
      } else {
        res.status(400).json('Unable to insert handle in db')
      }
    })
    .catch(err => res.status(400).json('Error updating handle in db'))
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  handleProfilePhoto
}