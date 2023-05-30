import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const userJwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.USER_JWT_SECRET || 'secret',
};

const adminJwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.ADMIN_JWT_SECRET || 'secret',
};

passport.use(
	'user-jwt',
	new JwtStrategy(userJwtOptions, async (payload, done) => {
		console.log(`user-payload: ${JSON.stringify(payload)}`);
		try {
			const user = await prisma.user.findUnique(
				{where:
					{id : payload.sub}
				}
			);
			if (user) {
				return done(null, payload);
			}else{
				return done(null, false);
			}
		} catch (error) {
			return done(error, false);
		}
	})
);

passport.use(
	'admin-jwt',
	new JwtStrategy(adminJwtOptions, async (payload, done) => {
		console.log(`admin-payload: ${JSON.stringify(payload)}`);
		try {
			const admin = await prisma.admin.findUnique(
				{where:
					{id : payload.sub}
				}
			);
			if (admin) {
				return done(null, payload);
			} else {
				return done(null, false);
			}
		} catch (error) {
			return done(error, false);
		}
	})
);
