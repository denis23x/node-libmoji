'use strict';
const cls = require('cls-hooked');
const namespace = cls.createNamespace('sequelize');
const Sequelize = require('sequelize');
const config = require('../database/config/config');

Sequelize.useCLS(namespace);

const db = new Sequelize(config[process.env.NODE_ENV]);

const connect = () => db.authenticate();

const op = Sequelize.Op;

module.exports = {
	connect,
	op
};
