'use strict';
const { user: User, session: Session } = require('./../database/models');
const { decodeToken } = require('./../services/jwt');
const { download } = require('./../services/axios');

const get = (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const { id } = decodeToken(token);

  User.findByPk(id, {
    raw: true,
    nest: true,
    include: [
      {
        model: Session,
        as: 'sessions',
        where: {
          access: token
        }
      }
    ]
  }).then(user => {
    const { sessions, ...u } = user;

    res.status(200).json(Object.assign(u, { access: sessions.access }));
  }).catch(({ message }) => res.status(500).json({ error: message }));
};

const patch = (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const { id } = decodeToken(token);
  const { name, avatar } = req.body;

  download(avatar).then(filename => {
    User.findByPk(id).then(user => {
      user.update({ name, avatar: filename }).then(user => {
        res.status(200).json(user.get());
      }).catch(({ message }) => res.status(500).json({ error: message }));
    }).catch(({ message }) => res.status(500).json({ error: message }));
  }).catch(({ message }) => res.status(500).json({ error: message }));
};

module.exports = {
  get,
  patch
};
