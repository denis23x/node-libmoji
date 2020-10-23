'use strict';
const router = require('express').Router();
const url = require('url');
const { jwtAccess, jwtDenied } = require('./services/middleware');
const { passport } = require('./services/passport');

const auth = require('./controllers/auth');
const profile = require('./controllers/profile');
const team = require('./controllers/team');

router.route('/api/login').post(jwtDenied, (req, res, next) => {
	passport.authenticate('JwtStrategy', (error, user, flash) => {
		if (error || !user) return res.status(401).json({ error: flash.message });
		req.user = user;
		next();
	})(req, res, next)
}, auth.login);
router.route('/api/login/google').get(jwtDenied, passport.authenticate('GoogleStrategy',  {
	scope: ['profile', 'email']
}));
router.route('/api/login/google/callback').get(jwtDenied, passport.authenticate('GoogleStrategy', {
	failureRedirect: process.env.APP_FRONTEND_URL
}), (req, res) => {
	const { email, password, googleId } = req.user;

	res.redirect(url.format({
		pathname: process.env.APP_FRONTEND_URL,
		query: { email, password, googleId }
	}));
});

router.route('/api/profile').get(jwtAccess, profile.get);
router.route('/api/profile').patch(jwtAccess, profile.patch);

router.route('/api/team').post(jwtAccess, team.post);

module.exports = {
	router
};
