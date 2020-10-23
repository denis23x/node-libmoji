'use strict';
const { session: Session } = require('./../database/models');
const { getTokensPair } = require('./../services/jwt');

const login = (req, res) => {
  const { hash: fingerprint } = req.fingerprint;
  const { user } = req;
  const { refresh, access } = getTokensPair(user);

  const sessionRecord = {
    userId: user.id,
    refresh, access, fingerprint
  };

  const successLogin = () => {
    const response = user.get();

    delete response.roleId;
    delete response.password;

    res.status(200).json({ ...response, access });
  };

  Session.findOrCreate({
    where: { fingerprint },
    defaults: sessionRecord
  }).then(([session, absent]) => {
    if (absent) {
      user.addSession(sessionRecord).then(successLogin).catch(({ message }) => {
        res.status(500).json({ error: message });
      });
    } else {
      session.update(sessionRecord).then(successLogin).catch(({ message }) => {
        res.status(500).json({ error: message });
      });
    }
  }).catch(({ message }) => {
    res.status(500).json({ error: message });
  });
};

module.exports = {
  login
};
