const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

module.exports = function(from = null, to, subject, text, html) {
  return transporter.sendMail({
    from: from || 'no-reply@exmaple.com',
    to,
    subject,
    text,
    html
  })
}
