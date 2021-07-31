const nodemailer = require('nodemailer');
const config = require('./../config/config');

const send = async (email, subject, content) => {
    console.log(config.emailService, config.email, config.emailPassword);
    var transporter = nodemailer.createTransport({
        service: config.emailService,
        auth: {
          user: config.email,
          pass: config.emailPassword
        }
      });
      
      var mailOptions = {
        from: config.email,
        to: email,
        subject: subject,
        text: content
      };
      
      const sent = await transporter.sendMail(mailOptions);
      return sent ? "Email sent.." : "Error sending email.";
};

module.exports = {
    send
};