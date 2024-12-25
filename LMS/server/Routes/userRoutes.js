import express from 'express'
import { checkEmailMiddlewares, signUpAdmin, signUpUser } from '../Controllers/signUpControllers.js';



const userRouters = express.Router();
userRouters.post('/signUpUser',checkEmailMiddlewares,signUpUser);
userRouters.post('/signUpAdmin',checkEmailMiddlewares, signUpAdmin);



export default userRouters;