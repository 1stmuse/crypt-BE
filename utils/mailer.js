const nodeMailer = require("nodemailer");
require("dotenv").config();

const transport = nodeMailer.createTransport({
  // service: "mail.cryptwaviloan.com",
  // name: "cryptwaviloan.com",
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transport;
