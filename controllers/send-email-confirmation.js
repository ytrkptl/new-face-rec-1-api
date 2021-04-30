'use strict';
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
    subject: `Yatrik's Face Recognition App - Confirmation`, 
    // plain text bodynpm 
    // text: 'Hello world?', 
    // don't allow sending html below
    html: `
      <table style="overflow-x:auto;width:100%;max-width:600px;border:1px solid black;margin:auto">
        <tr style="height:50px;background:lightgray">
          <th style="border-bottom:1px solid black;">Yatrik's Face Recognition App - Confirmation </th>
        </tr>
        <tr style="overflow-x:auto;width:100%;border:1px solid black;background:#def;">
          <td style="padding:30px;">
            <p>Hello,</p>
            <p>Welcome to Yatrik's Face Recognition App!</p>
            <p>Thank you for signing up. There is one last step to complete the sign-up process though: Simply copy and 
              paste the code provided below into the "Confirmation" input 
              provided on our site.
            <p>
            <table>
              <tr>
                <td style="background-color:lightgray;padding:10px;cursor:pointer;">
                  <h3 style="padding:auto;margin:auto">${someToken}</h3>
                </td>
              </tr>
            </table>
            <p>Thank you!<br/>-Yatrik Patel</p>
            <span style="font-style: italic">Ps...did you try using the "toggle rain" button at the top left of our site? If not yet, please do check it out 
            at <a href="https://new-face-rec-1-api.herokuapp.com/">this link</a>.</span>
          </td>
        </tr>
      </table>
`};

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

module.exports = { handleSendingEmailConfirmation }