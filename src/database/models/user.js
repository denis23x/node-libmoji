'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.role, {
        as: 'role',
        foreignKey: 'roleId',
        sourceKey: 'id'
      });
      this.hasMany(models.session, {
        as: 'sessions',
        foreignKey: 'userId',
        sourceKey: 'id'
      });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Name already in use'
      },
      validate: {
        len: {
          args: [4, 20],
          msg: 'Name field must contain at least 4 and no more than 20 characters'
        }
      }
    },
    avatar: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    googleId: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Email address already in use'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email address'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt']
      }
    }
  });

  return User;
};
