'use strict';
const { verifyToken, getTokensPair } = require('../services/jwt');
const { session: Session } = require('../database/models');
const { op } = require('../database/database');

const jwtAccess = (req, res, next) => {
  if (req.headers.authorization) {
    const access = req.headers.authorization.replace('Bearer ', '');
    const { hash: fingerprint } = req.fingerprint;

    Session.findOne({
      where: { [op.and]: [ { access }, { fingerprint } ] },
    }).then(session => {
      !session ? res.status(401).json({ error: 'Session not found' }) :
      verifyToken(access, 'access').then(() => {
        next();
      }).catch(({ name }) => {
        name !== 'TokenExpiredError' ? res.status(401).json({ error: 'Access token signature error' }) :
        verifyToken(session.refresh, 'refresh').then(user => {
          const { refresh, access } = getTokensPair(user);

          session.update({ refresh, access }).then(() => {
            req.headers.authorization = `Bearer ${access}`
            next();
          }).catch(({ message }) => {
            res.status(401).json({ error: message });
          });
        }).catch(() => {
          res.status(401).json({ error: 'Refresh token signature error' });
        });
      });
    }).catch(({ message }) => {
      res.status(401).json({ error: message });
    });
  } else {
    res.status(401).json({ error: 'Access token not provided' });
  }
}

const jwtDenied = (req, res, next) => next();

module.exports = {
  jwtAccess,
  jwtDenied
};
