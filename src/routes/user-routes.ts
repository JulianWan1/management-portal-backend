import { Post, PrismaClient } from '@prisma/client';
import { Response, Router } from 'express';
import passport from 'passport';

const userRouter:Router = Router();
const prisma = new PrismaClient();

// Get all posts for user TESTED
// Had to change req to any type as it will not interfere with the destructuring of req.user
userRouter.get('/posts', passport.authenticate('user-jwt', { session: false }), async (req:any, res: Response) => {

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
userRouter.post('/bill', passport.authenticate('user-jwt', { session: false }), (req: any, res: Response) => {
  


});


export default userRouter;
