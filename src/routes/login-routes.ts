import { Router } from 'express';
import passport from 'passport';
import { generateAdminAccessToken, generateUserAccessToken } from '../auth/auth-methods';

const loginRouter:Router = Router();

// Login for admins TESTED
loginRouter.post('/admin', passport.authenticate('admin-login', { session: false }), (req, res) => {
	const token = generateAdminAccessToken(req.user);
	res.json({ access_token: token });
});

// Login for users TESTED
loginRouter.post('/user', passport.authenticate('user-login', { session: false }), (req, res) => {
	const token = generateUserAccessToken(req.user);
	res.json({ access_token: token });
}
);

export default loginRouter;
