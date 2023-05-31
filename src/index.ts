import express from 'express';
import passport from 'passport';
import './auth/strategies/local.strategy'
import './auth/strategies/jwt-access.strategy'
import userRouter from "./routes/user-routes"
import adminRouter from './routes/admin-routes';
import vendorRouter from './routes/vendor-routes';
import loginRouter from './routes/login-routes';



const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(passport.initialize());

app.use("/v1/login", loginRouter)
app.use("/v1/admins", adminRouter);
app.use("/v1/users", userRouter);
app.use("/v1/vendors", vendorRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
