// 'use strict';
const nodemailer = require('nodemailer');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// try using an alias instead of the acutal email address.
// haven't tried alias yet. may not work.
// am using MailThis.to, FormSubmit, FormSpree, etc. instead.

const handleSendingEmailConfirmation = (someToken, req, res) => {
  
  const { email, name, password } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    }
  });
  let mailOptions = {
    //only using my email to send from
    from: process.env.USER_EMAIL,
    //only using my email to send to
    to: `${email}`,
    // Subject line
    subject: `From ${name}`, 
    // plain text bodynpm 
    // text: 'Hello world?', 
    // don't allow sending html below
    html: `
      <h2>${name}</h2>
      <br/>
      <h3>Copy the code below and paste it in the confirmation box provided.<h3>
      <a>${someToken}</a>
      `
};

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return res.status(400).send(`Something went wrong. Please use the following email
        address to send Yatrik an email: ${process.env.USER_EMAIL_ID_TO_SHOW}`);
    } else {
      return res.status(200).send(`Your email was sent successfully. Yatrik will
        get back in touch with you as soon as possible. Thanks for your interest.`);
    }
  });
}

module.exports = {
  handleSendingEmailConfirmation: handleSendingEmailConfirmation
}