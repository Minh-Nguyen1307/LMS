import express from 'express'
import { checkEmailMiddlewares, signUpUser } from '../Controllers/signUpControllers.js';
import { signInUser } from '../Controllers/signInControllers.js';



const userRouters = express.Router();
userRouters.post('/signUpUser',checkEmailMiddlewares,signUpUser);

userRouters.post('/signInUser',signInUser);


export default userRouters;