const nodemailer = require("nodemailer");
const sendEmail=async (options)=> {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
const message={
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`,
    to: `${options.email}`, // list of receivers
    subject:`${options.subject}`, // Subject line
    text: `${options.message}`, // plain text body
  };

  let info = await transporter.sendMail(message)
}
module.exports =sendEmail