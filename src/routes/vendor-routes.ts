import { Request, Response, Router } from 'express';

const vendorRouter:Router = Router();

// To update user's membership after Bill was paid for
vendorRouter.patch('/membership/:userId', (req: Request, res: Response) => {
  
});


export default vendorRouter;
