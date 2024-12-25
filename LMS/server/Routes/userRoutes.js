import express from 'express'
import { signUpAdmin, signUpUser } from '../Controllers/signUpControllers.js';
import { checkEmailMiddlewares } from '../Middlewares/checkEmailMiddlewares.js';


const userRouters = express.Router();
userRouters.post('/signUpUser',checkEmailMiddlewares,signUpUser);
userRouters.post('/signUpAdmin',checkEmailMiddlewares, signUpAdmin);



export default userRouters;