import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client'

const adminRouter:Router = Router();
const prisma = new PrismaClient();

// Login for admins
adminRouter.post('/login', (req: Request, res: Response) => {
  const adminDetails = req.body;
	
});

// Create new admins
adminRouter.post('/admin', (req: Request, res: Response) => {
  async function createAdmin(){

	};
});

// Create new users
adminRouter.post('/users', (req: Request, res: Response) => {
  async function createUser(){

	};
});

// Create new posts
adminRouter.post('/posts', (req: Request, res: Response) => {
  const newPost = req.body;
	console.log(newPost);
	async function createPost(){
		
	}
});



// Get all posts (list all categories)
adminRouter.get('/posts', (req: Request, res: Response) => {
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
	
		const foundPosts = await prisma.post.findMany({ where });
		console.log(foundPosts);
		res.send(foundPosts);
	}
	getPosts()
		.then(async () => {
			await prisma.$disconnect()
		})
		.catch(async (e) => {
			console.log(e);
			await prisma.$disconnect();
			process.exit(1);
		});

});


// Update user's details / Delete user
adminRouter.route('/users/:userId')
	.patch( (req: Request, res: Response) => {
		res.send('Hello World!');
	})
	.delete( (req: Request, res: Response) => {
		res.send('Hello World!');
	});

// Update post's details / Delete post
adminRouter.route('/posts/:postId')
	.patch( (req: Request, res: Response) => {
		res.send('Hello World!');
	})
	.delete( (req: Request, res: Response) => {
		res.send('Hello World!');
	});

// Update category's details / Delete category
adminRouter.route('/categories/:categoryId')
	.patch( (req: Request, res: Response) => {
		res.send('Hello World!');
	})
	.delete( (req: Request, res: Response) => {
		res.send('Hello World!');
	});

export default adminRouter;