import { Post, PrismaClient } from '@prisma/client';
import { Response, Router } from 'express';
import passport from 'passport';
const axios = require('axios');

const userRouter:Router = Router();
const prisma = new PrismaClient();

// Set user jwt middleware for all user related routes
userRouter.use(passport.authenticate('user-jwt', { session: false }));

// Get all posts for user 
// Had to change req to any type as it will not interfere with the destructuring of req.user
userRouter.get('/posts', async (req:any, res: Response) => {

	const {postId} = req.query;
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// get the membership field from the returned jwt payload (found in req.user)
	const {membership} = req.user;

	// query to get all posts or posts that match the query
  async function getPosts(){
		let where = {};

		if (membership === 'NORMAL') {
			where = {
				AND: [
					{ label: `NORMAL` },
					{ id: postId? Number(postId) : undefined }
				],
			};
		} else {
			where = {
				id: postId? Number(postId) : undefined 
			}
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

// Post the bill of payment to BillPlz
userRouter.post('/bill', async (req: any, res: Response) => {
  
	const {sub} = req.user;

	try{
		const user = await prisma.user.findUnique({
			where:{
				id: sub
			}
		})
	
		// If user is found, proceed to create & post bill to collection
		if(user){
			const {
				id,
				email,
				full_name
			} = user

			const membershipFee:number = 500;
			const userId = id;

			// Call the billing API from BillPlz
			const response = await axios.post(
				'https://www.billplz-sandbox.com/api/v3/bills',
				{
					collection_id: process.env.BILLPLZ_COLLECTION_ID,
					email: email,
					name: full_name,
					amount: membershipFee,
					description: 'Bill for Premium membership',
					callback_url: `<ngrok url that points to http://localhost:3001>/v1/vendors/membership/${userId}` // TODO: Change the url to something that BillPlz can callback on
				},{
					headers: {
						Authorization: `Basic ${process.env.BILLPLZ_API_SECRET_ENCODED}`
					},
				}
			);

			res.json(response.data);

		}
	}catch(e){
		console.log(e);
		res.status(500).send('Internal Server Error')
	}finally{
		await prisma.$disconnect();
	};

});


export default userRouter;
