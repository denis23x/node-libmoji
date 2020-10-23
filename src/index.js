'use strict';
const env = require('dotenv').config();
const express = require("express");
const { connect } = require('./database/database');
const { router } = require('./router');
const passport = require('passport');
const cors = require('cors');
const Fingerprint = require('express-fingerprint');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(Fingerprint({
	parameters: [
		Fingerprint.useragent,
		Fingerprint.acceptHeaders
	]
}));
app.use(router);

connect().then(() => {
	app.listen(process.env.APP_PORT, () => {
		console.log(`Server started at http://localhost:${process.env.APP_PORT}!`);
	});
}).catch(() => {
	console.log('Unable to connect to the database');
	process.exitCode = 1;
});
