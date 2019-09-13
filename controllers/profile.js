

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

const handleProfilePhoto = (req, res, base) => {
  const { id } = req.params;
  const { photourl } = req.body;

  base('Table 1').create([
    {
      "fields": {
        "dbId": id,
        "photourl": photourl
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      res.status(400).send('some error occured')
      return;
    }
    records.forEach(function (record) {
      let url = record.url;
      console.log(record.url);
      res.status(200).send(record.url)
      return;
    });
  });


  // return db('users')
  //   .where({ id })
  //   .update({ photourl })
  //   .then(resp => {
  //     if(resp) {
  //       res.json("success")
  //     } else {
  //       res.status(400).json('Unable to update')
  //     }
  //   })
  //   .catch(err => res.status(400).json('Error updating user'))
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  handleProfilePhoto
}