import { Request, Response, Router } from 'express';

const adminRouter:Router = Router();

// Login for admins
adminRouter.post('/login', (req: Request, res: Response) => {
  const adminDetails = req.body;
	
});

// Create new admins
adminRouter.post('/admin', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Create new users
adminRouter.post('/users', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Create new posts
adminRouter.post('/posts', (req: Request, res: Response) => {
  res.send('Hello World!');
});



// Get all posts (list all categories)
adminRouter.get('/posts', (req: Request, res: Response) => {
  res.send('Hello World!');
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