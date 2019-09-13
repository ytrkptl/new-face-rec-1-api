

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

const handleProfilePhoto = (req, res, db, base) => {
  const { id } = req.params;
  const { photourl } = req.body;
  console.log(photourl);
  
  let responseToSend = '';


  base('Table 1').create([
    {
      "fields": {
        "dbId": id,
        "photourl": photourl
      }
    }
  ], function(err, records) {
    if (err) {
      let responseToSend = responseToSend + 'error occured in Airtable ';
    }
    records.forEach(function (record) {
      let someurl = record.get('photourl');
      responseToSend = `${someurl} was inserted in airtable`;
      return;
    });
  });

  db('users')
    .where({ id })
    .update({ photourl })
    .then(resp => {
      if(resp) {
        let responseToSend = responseToSend + 'successfully inserted photourl in db'
        res.status(200).json(responseToSend);
      } else {
        responseToSend = responseToSend + 'Unable to insert photourl in db'
        res.status(400).json(responseToSend)
      }
    })
    .catch(err => res.status(400).json('Error updating user in db'))
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  handleProfilePhoto
}