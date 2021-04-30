'use strict';
const nodemailer = require('nodemailer');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// try using an alias instead of the acutal email address.
// haven't tried alias yet. may not work.
// am using MailThis.to, FormSubmit, FormSpree, etc. instead.

const handleSendingEmail = (someToken, req, res) => {
  const { yourEmail, name, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    }
  });

  let mailOptions = {
    //only using my email to send from
    from: `Yatrik Patel ${process.env.USER_EMAIL}`,
    //only using my email to send to
    to: `${yourEmail}`,
    // Subject line
    subject: `Yatrik's Face Recognition App - Forgot Password Step 1`, 
    // plain text body
    // text: 'Hello world?', 
    // don't allow sending html below
    html: `
      <table style="overflow-x:auto;width:100%;max-width:600px;border:1px solid black;margin:auto">
        <tr style="height:50px;background:lightgray">
          <th style="border-bottom:1px solid black;">Yatrik's Face Recognition App - Forgot Password Step 1</th>
        </tr>
        <tr style="overflow-x:auto;width:100%;border:1px solid black;background:#def;">
          <td style="padding:30px;">
            <p>Hi there,</p>
            <p>Did you forget your password? We're sorry to hear that. 
              Here is how you can retrieve it:  Simply copy and 
              paste the code provided below into the "resetId" input 
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

module.exports = { handleSendingEmail }