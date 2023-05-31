import { Membership, PrismaClient } from '@prisma/client';
import { Response, Router } from 'express';

const vendorRouter:Router = Router();
const prisma = new PrismaClient();

// To update user's membership after Bill was paid for
vendorRouter.post('/membership/:userId', async (req: any, res: Response) => {
  console.log(`updating membership status & creating payment record...`);

  const { userId } = req.params;
  const { id, paid_amount, state } = req.body;

	// Make a transaction instead of individual queries so as to have them succeed or fail cumulatively
  try {
    await prisma.$transaction(async (trx) => {
      const updatedUser = await trx.user.update({
        where: { id: Number(userId) },
        data: {
          membership: Membership.PREMIUM,
        },
      });

      const paymentMade = await trx.payment.create({
        data: {
          id,
          amount: Number(paid_amount/100), // Returned in cents, hence divide by 100
          payment_method: 'Online', // No payment method seen from the request body, hence placed Online as placeholder for now
          status: state,
        },
      });

      console.log(`Updated user details after premium membership payment: ${JSON.stringify(updatedUser)}`);
      console.log(`Premium Membership Payment made: ${JSON.stringify(paymentMade)}`);
      res.send([updatedUser, paymentMade]);
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  } finally {
    await prisma.$disconnect();
  }
});


export default vendorRouter;
