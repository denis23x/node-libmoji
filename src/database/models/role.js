'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.hasMany(models.user, {
        as: 'users',
        foreignKey: 'roleId',
        sourceKey: 'id'
      });
    }
  }

  Role.init({
    name: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Name already in use'
      },
      validate: {
        len: {
          args: [2, 20],
          msg: 'Name field must contain at least 2 and no more than 20 characters'
        },
      }
    }
  }, {
    sequelize,
    modelName: 'role',
    timestamps: false,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt']
      }
    }
  });

  return Role;
};
