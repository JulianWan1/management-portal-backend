import { Admin, PrismaClient, User } from "@prisma/client";
import { Bcrypt } from "./utils/bcrypt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

	// Function to generate JWT access token
export const generateUserAccessToken = (user:any) => {
	const payload = { sub: user.id, user_name:user.user_name, membership:user.membership };
	const options = { expiresIn: '1m' };
	return jwt.sign(payload, process.env.USER_JWT_SECRET || 'usersecret', options);
};

export const generateAdminAccessToken = (admin:any) => {
	const payload = { sub: admin.id, user_name: admin.user_name };
	const options = { expiresIn: '1m' };
	return jwt.sign(payload, process.env.ADMIN_JWT_SECRET || 'adminsecret', options);
};