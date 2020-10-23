'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // define association here
    }
  }

  Session.init({
    userId: DataTypes.INTEGER,
    refresh: {
      type: DataTypes.TEXT,
      unique: {
        args: true,
        msg: 'Refresh token was already generated'
      }
    },
    access: {
      type: DataTypes.TEXT,
      unique: {
        args: true,
        msg: 'Access token was already generated'
      }
    },
    fingerprint: {
      type: DataTypes.TEXT,
      unique: {
        args: true,
        msg: 'Fingerprint already generated'
      }
    }
  }, {
    sequelize,
    modelName: 'session'
  });
  return Session;
};
