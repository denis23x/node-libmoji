'use strict';
const { verify, sign, decode } = require('jsonwebtoken');

const env = {
  secret: {
    access: process.env.APP_JWT_ACCESS_SECRET,
    refresh: process.env.APP_JWT_REFRESH_SECRET
  },
  access: {
    issuer: process.env.APP_JWT_ACCESS_ISSUER,
    audience: process.env.APP_JWT_ACCESS_AUDIENCE,
    expiresIn: process.env.APP_JWT_ACCESS_EXPIRES
  },
  refresh: {
    issuer: process.env.APP_JWT_REFRESH_ISSUER,
    audience: process.env.APP_JWT_REFRESH_AUDIENCE,
    expiresIn: process.env.APP_JWT_REFRESH_EXPIRES
  }
};

const verifyToken = (token, type) => {
  return new Promise((resolve, reject) => {
    verify(token, env.secret[type], { ...env[type] }, (err, decoded) => err ? reject(err) : resolve(decoded));
  });
};

const signToken = (payload, type) => {
  return sign(payload, env.secret[type], env[type]);
};

const decodeToken = token => {
  return decode(token);
};

const getTokensPair = ({ id, email }) => {
  return {
    refresh: signToken({ id, email }, 'refresh'),
    access: signToken({ id, email }, 'access')
  };
};

module.exports = {
  verifyToken,
  signToken,
  decodeToken,
  getTokensPair
};
