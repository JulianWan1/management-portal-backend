import { Request, Response, Router } from 'express';

const userRouter:Router = Router();

// Login for users
userRouter.post('/login', (req: Request, res: Response) => {
  const userDetails = req.body;
	// check if premium or normal
});

// Get all posts for user
userRouter.get('/posts?post=postId', (req: Request, res: Response) => {
  // check if premium or normal label
	// normal, show normal labelled content only
	// premium, show all labelled content
});

// Post the bill of payment to BillPlz
userRouter.post('/bill', (req: Request, res: Response) => {
  
});


export default userRouter;
