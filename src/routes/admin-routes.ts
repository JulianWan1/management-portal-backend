import { Request, Response, Router } from 'express';
import { Admin, Category, Post, PrismaClient, User } from '@prisma/client'
import passport from 'passport';
import { Bcrypt } from '../auth/utils/bcrypt';
import { NewUserPassword } from '../interfaces/users-interfaces';

// TODO: ERROR HANDLING FOR ALL ENDPOINTS (WITH CUSTOM ERROR MESSAGES)

const adminRouter:Router = Router();
const prisma = new PrismaClient();

// Create new admin TESTED
adminRouter.post('/', async (req: Request, res: Response) => {

	const {
		user_name,
		password,
		email,
		full_name,
	} = req.body

	console.log(`Salting & hashing password for new admin...`)

	const hashAndSalt: NewUserPassword = await Bcrypt.createPasswordHash(password);
	const {hashSaltPassword, salt} = hashAndSalt;

	const adminRegistrationBody = {
		user_name,
		hashSaltPassword,
		salt,
		email,
		full_name,
	}

	console.log(`New admin to be added: ${JSON.stringify(adminRegistrationBody)}`);

  async function createAdmin(){
		const createdAdmin:Admin = 
		await prisma.admin.create({
			data: {
				user_name,
				hashed_password: hashSaltPassword,
				salt: salt,
				email,
				full_name
			}
		});
	res.send(createdAdmin)
	};

	try{
		createAdmin()
		.catch(async (e) => {
			console.log(e);
			res.status(500).send('Internal Server Error')
		})
	}
	finally{
		await prisma.$disconnect();
	};

});

// Create new users TESTED
adminRouter.post('/users', async (req: Request, res: Response) => {

  const {
		user_name,
		password,
		email,
		full_name,
		membership
	} = req.body;

	console.log(`Salting & hashing password for new user...`)

	const hashAndSalt: NewUserPassword = await Bcrypt.createPasswordHash(password);
	const {hashSaltPassword, salt} = hashAndSalt;

	const userRegistrationBody = {
		user_name,
		hashSaltPassword,
		salt,
		email,
		full_name,
	}

	console.log(`New user to be added: ${JSON.stringify(userRegistrationBody)}`);

	async function createUser(){
		const createdUser:User = 
			await prisma.user.create({
				data: {
					user_name,
					hashed_password: hashSaltPassword,
					salt: salt,
					email,
					full_name,
					membership
				}
			});
		res.send(createdUser)
	}

	try{
		createUser()
		.catch(async (e) => {
			console.log(e);
			res.status(500).send('Internal Server Error')
		})
	}
	finally{
		await prisma.$disconnect();
	};

});

// Create new Category TESTED
adminRouter.post('/categories', async (req: Request, res: Response) => {

  const {
		name,
		description,
		activated,
	} = req.body;

	console.log(`New category to be added: ${JSON.stringify(req.body)}`);

	// Query to add a new post to the Post model
	async function createCategory(){
		const createdCategory:Category = 
			await prisma.category.create({
				data: {
				name,
				description,
				activated,
				}
			});
		res.send(createdCategory)
	}

	try{
		createCategory()
		.catch(async (e) => {
			console.log(e);
			res.status(500).send('Internal Server Error')
		})
	}
	finally{
		await prisma.$disconnect();
	};

});

// Create new posts TESTED
adminRouter.post('/posts', async (req: Request, res: Response) => {

  const {
		title,
		body,
		category_id,
		status,
		label,
	} = req.body;

	console.log(`New post to be added: ${JSON.stringify(req.body)}`);

	// Query to add a new post to the Post model
	async function createPost(){
		const createdPost:Post = 
			await prisma.post.create({
				data: {
				title,
				body,
				category_id,
				status,
				label,
				}
			});
		res.send(createdPost)
	};

	try{
		createPost()
		.catch(async (e) => {
			console.log(e);
			res.status(500).send('Internal Server Error')
		})
	}
	finally{
		await prisma.$disconnect();
	};

});



// Get all posts (list all categories) TESTED
adminRouter.get('/posts', async (req: Request, res: Response) => {

	const {category, label} = req.query;
	// query to get all posts or posts that match the query
  async function getPosts(){
		let where = {};

		if (category && label) {
			where = {
				AND: [
					{ categoryId: Number(category) },
					{ label: String(label) },
				],
			};
		} else if (category) {
			where = { categoryId: Number(category) };
		} else if (label) {
			where = { label: String(label) };
		}
	
		const foundPosts:Post[] = await prisma.post.findMany({ where });
		console.log(foundPosts);
		res.send(foundPosts);
	}

	try{
		getPosts()
		.catch(async (e) => {
			console.log(e);
			res.status(500).send('Internal Server Error')
		})
	}		
	finally{
		await prisma.$disconnect();
	}

});


// Update admin's details / Delete admin TESTED
adminRouter.route('/:adminId')
	.patch( async (req: Request, res: Response) => {

		const {
			user_name,
			email, 
			full_name, 
			membership, 
		} = req.body;

		const { adminId } = req.params

		const { password, ...userDetailsToUpdate } = req.body;

		let generatedHashedPassword: string;
		let generatedSalt: string;

		console.log(`Details to update for admin ${ adminId } (password is not shown): ${JSON.stringify(userDetailsToUpdate)}`);

		if(password){
			console.log(`Salting & hashing new password for admin of ID ${adminId}...`)

			const hashAndSalt: NewUserPassword = await Bcrypt.createPasswordHash(password);
			const {hashSaltPassword, salt} = hashAndSalt;

			generatedHashedPassword = hashSaltPassword;
			generatedSalt = salt;
		}

		async function updateAdmin(){
			const updatedUser = await prisma.admin.update({
				where: {id: Number(adminId)},
				data:{
					user_name: user_name ? user_name : undefined, 
					hashed_password: password ? generatedHashedPassword : undefined, 
					salt: generatedSalt ? generatedSalt : undefined, 
					email: email ? email : undefined, 
					full_name: full_name ? full_name : undefined, 
					updated_at: new Date
				}
			})
			console.log(`Updated user details: ${JSON.stringify(updatedUser)}`);
			res.send(updatedUser);
		};
		
		try{
			updateAdmin()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	})
	.delete( async (req: Request, res: Response) => {

		const { adminId } = req.params

		console.log(`Deleting Admin with ID ${ adminId }...`);

		async function deleteAdmin(){
			const deletedAdmin = await prisma.admin.delete({
				where: {id: Number(adminId)},
			})
			console.log(`Successfully deleted admin with ID ${ adminId }: ${JSON.stringify(deletedAdmin)}`);
			res.send(deletedAdmin);
		};
		
		try{
			deleteAdmin()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	});


	// Update user's details / Delete user TESTED
	adminRouter.route('/users/:userId')
	.patch( async (req: Request, res: Response) => {

		const {
			user_name,
			email, 
			full_name, 
			membership, 
		} = req.body;

		const { userId } = req.params

		const { password, ...userDetailsToUpdate } = req.body;

		let generatedHashedPassword: string;
		let generatedSalt: string;

		console.log(`Details to update for user ${ userId } (password is not shown): ${JSON.stringify(userDetailsToUpdate)}`);

		if(password){
			console.log(`Salting & hashing new password for admin of ID ${userId}...`)

			const hashAndSalt: NewUserPassword = await Bcrypt.createPasswordHash(password);
			const {hashSaltPassword, salt} = hashAndSalt;

			generatedHashedPassword = hashSaltPassword;
			generatedSalt = salt;
		}

		async function updateUser(){
			const updatedUser = await prisma.user.update({
				where: {id: Number(userId)},
				data:{
					user_name: user_name ? user_name : undefined, 
					hashed_password: password ? generatedHashedPassword : undefined, 
					salt: generatedSalt ? generatedSalt : undefined, 
					email: email ? email : undefined, 
					full_name: full_name ? full_name : undefined, 
					membership: membership ? membership : undefined, 
					updated_at: new Date
				}
			})
			console.log(`Updated user details: ${JSON.stringify(updatedUser)}`);
			res.send(updatedUser);
		};
		
		try{
			updateUser()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	})
	.delete( async (req: Request, res: Response) => {

		const { userId } = req.params

		console.log(`Deleting User with ID ${ userId }...`);

		async function deleteUser(){
			const deletedUser = await prisma.user.delete({
				where: {id: Number(userId)},
			})
			console.log(`Successfully deleted user with ID ${ userId }: ${JSON.stringify(deletedUser)}`);
			res.send(deletedUser);
		};
		
		try{
			deleteUser()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	});


// Update post's details / Delete post TESTED
adminRouter.route('/posts/:postId')
	.patch( async (req: Request, res: Response) => {

		const {
			title,
			body,
			category_id,
			status,
			label,
		} = req.body;

		const { postId } = req.params

		console.log(`Details to update Post ${ postId }: ${JSON.stringify(req.body)}`);

		async function updatePost(){
			const updatedPost = await prisma.post.update({
				where: {id: Number(postId)},
				data:{
					title: title ? title : undefined, 
					body: body ? body : undefined, 
					category_id: category_id ? category_id : undefined, 
					status: status ? status : undefined, 
					label: label ? label : undefined,  
					updated_at: new Date
				}
			})
			console.log(`Updated post details: ${JSON.stringify(updatedPost)}`);
			res.send(updatedPost);
		};
		
		try{
			updatePost()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	})
	.delete( async (req: Request, res: Response) => {

		const { postId } = req.params

		console.log(`Deleting Post with ID ${ postId }...`);

		async function deletePost(){
			const deletedPost = await prisma.post.delete({
				where: {id: Number(postId)},
			})
			console.log(`Successfully deleted post with ID ${ postId }: ${JSON.stringify(deletedPost)}`);
			res.send(deletedPost);
		};
		
		try{
			deletePost()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	});

// Update category's details / Delete category TESTED
adminRouter.route('/categories/:categoryId')
	.patch( async (req: Request, res: Response) => {
		
		const {
			name,
			description,
			activated
		} = req.body;

		const { categoryId } = req.params

		console.log(`Details to update Category ${ categoryId }: ${JSON.stringify(req.body)}`);

		async function updateCategory(){
			const updatedCategory = await prisma.category.update({
				where: {id: Number(categoryId)},
				data:{
					name: name ? name : undefined, 
					description: description ? description : undefined, 
					activated: activated, 
					updated_at: new Date
				}
			})
			console.log(`Updated category details: ${JSON.stringify(updatedCategory)}`);
			res.send(updatedCategory);
		};
		
		try{
			updateCategory()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	})
	.delete( async (req: Request, res: Response) => {

		const { categoryId } = req.params

		console.log(`Deleting Category with ID ${ categoryId }...`);

		async function deleteCategory(){
			const deletedCategory = await prisma.category.delete({
				where: {id: Number(categoryId)},
			})
			console.log(`Successfully deleted category with ID ${ categoryId }: ${JSON.stringify(deletedCategory)}`);
			res.send(deletedCategory);
		};
		
		try{
			deleteCategory()
			.catch(async (e) => {
				console.log(e);
				res.status(500).send('Internal Server Error')
			})
		}
		finally{
			await prisma.$disconnect();
		}

	});

export default adminRouter;