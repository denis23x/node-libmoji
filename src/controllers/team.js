'use strict';
const { user: User, session: Session } = require('./../database/models');
const { decodeToken } = require('./../services/jwt');

const { sendMail } = require('./../services/mailer');

const post = (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const { id } = decodeToken(token);
  const emails = req.body;

  emails.forEach(email => {
    sendMail('invite', {
      from: 'Cooplay',
      to: email
    });
  });

  res.send(200).json({ message: 'All good!' });



  // User.findByPk(id, {
  //   raw: true,
  //   nest: true,
  //   include: [
  //     {
  //       model: Session,
  //       as: 'sessions',
  //       where: {
  //         access: token
  //       }
  //     }
  //   ]
  // }).then(user => {
  //   const { sessions, ...u } = user;
  //
  //   res.status(200).json(Object.assign(u, { access: sessions.access }));
  // }).catch(({ message }) => res.status(500).json({ error: message }));
};

module.exports = {
  post
};
