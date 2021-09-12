const nodemailer = require('nodemailer')
const user = process.env.EMAIL
const password = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: password
  }
})

module.exports = transporter
