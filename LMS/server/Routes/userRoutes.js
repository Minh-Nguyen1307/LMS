import express from 'express'
import { checkEmailUser, signUpAdmin, signUpUser } from '../Controllers/signUpControllers.js';


const userRouters = express.Router();
userRouters.post('/checkEmailUser', checkEmailUser);
userRouters.post('/signUpUser', signUpUser);
userRouters.post('/signUpAdmin', signUpAdmin);



export default userRouters;