'use strict';
const nodemailer = require('nodemailer');

const sendMail = (template, data) => {
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_DEV_USERNAME,
      pass: process.env.MAILER_DEV_PASSWORD
    }
  }).sendMail(templates[template](data));
};

const templates = {
  generalSettings: (from, to) => ({
    from: `${from} <${process.env.MAILER_DEV_USERNAME}>`,
    to: to,
    subject: 'Приглашение в команду Cooplay'
  }),
  invite: ({ from, to }) => ({
    ...templates.generalSettings(from, to),
    html:
      `<div>
         <p>Добрый день! Приглашаем в команду</p>
         <p>link</p>
       </div>`
  })
};

module.exports = {
  sendMail
};
