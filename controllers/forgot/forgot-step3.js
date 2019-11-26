/*This corresponds to Step 3 of Forgot Password
It only happens if Step 1 and 2 are fulfilled,
followed by filling both "new password" and "confirm new password"*/

const handleUpdateNewPassword = async (req, res, db, bcrypt) => {

  const { yourEmail, newPassword, confirmNewPassword } = req.body;
 
  if (!yourEmail || !newPassword || !confirmNewPassword) {
    return res.status(200).json(`'New Password' and 'Confirm New Password' fields cannot be empty!`)
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(200).json(`'Confirm New Password' did not match`)
  }

  const saltRounds = 10;
  const newHash = bcrypt.hashSync(newPassword, saltRounds);
  return db.transaction(trx => {
    trx.select('hash').from('login')
    .where('email', '=', yourEmail)
    .update({hash: newHash})
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .then(()=>{return res.status(200).json('Password reset complete')})
  .catch(err => console.log('from forgot step 3 ' + err))
}

module.exports = {
  handleUpdateNewPassword: handleUpdateNewPassword
}