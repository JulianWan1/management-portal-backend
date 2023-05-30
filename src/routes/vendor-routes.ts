import { Membership, PrismaClient } from '@prisma/client';
import { Response, Router } from 'express';

const prisma = new PrismaClient();

const vendorRouter:Router = Router();

// To update user's membership after Bill was paid for
vendorRouter.post('/membership', async (req: any, res: Response) => {

	const {userId, id, paid_amount, state} = req.params

	async function updateUserAndCreatePayment(){

		const updatedUser = await prisma.user.update({
			where: {id: Number(userId)},
			data:{
				membership: Membership.PREMIUM 
			}
		})

		const paymentMade = await prisma.payment.create({
			data: {
				id,
				amount: paid_amount,
				payment_method: 'Online', // Couldn't find from their documentation which states which payment method
				status:state
			}
		})

		console.log(`Updated user details after premium membership payment: ${JSON.stringify(updatedUser)}`);
		console.log(`Premium Membership Payment made: ${JSON.stringify(paymentMade)}`)
		res.send([updatedUser, paymentMade]);

	};
	
	try{
		updateUserAndCreatePayment()
		.catch(async (e) => {
			console.log(e);
			res.status(500).send('Internal Server Error')
		})
	}
	finally{
		await prisma.$disconnect();
	}

});


export default vendorRouter;
