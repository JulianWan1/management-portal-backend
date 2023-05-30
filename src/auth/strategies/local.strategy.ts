import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient } from '@prisma/client';
import { Bcrypt } from '../utils/bcrypt';

const prisma = new PrismaClient();

// for user login
passport.use(
	'user-login',
  new LocalStrategy(
    { usernameField: 'user_name' },
    async (userName: string, password: string, done: any) => {
      try {
        const user = await prisma.user.findUnique({ where: { user_name: userName } });
        if (!user) {
					console.log('Incorrect username or password');
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        const passwordsMatch = await Bcrypt.validatePassword(password, user.hashed_password);
        if (!passwordsMatch) {
					console.log('Incorrect username or password');
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// for admin login
passport.use(
	'admin-login',
  new LocalStrategy(
    { usernameField: 'user_name' },
    async (userName: string, password: string, done: any) => {
      try {
        const admin = await prisma.admin.findUnique({ where: { user_name: userName } });
        if (!admin) {
					console.log('Incorrect username or password');
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        const passwordsMatch = await Bcrypt.validatePassword(password, admin.hashed_password);
        if (!passwordsMatch) {
					console.log('Incorrect username or password');
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, admin);
      } catch (err) {
        return done(err);
      }
    }
  )
);