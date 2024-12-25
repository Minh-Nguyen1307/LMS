import express from 'express'
import { checkEmailMiddlewares, signUpUser } from '../Controllers/signUpControllers.js';
import { signInUser } from '../Controllers/signInControllers.js';
import { getCourseById, getTopCoursesByEnrollment } from '../Controllers/courseControllers.js';



const userRouters = express.Router();
userRouters.post('/signUpUser',checkEmailMiddlewares,signUpUser);
userRouters.post('/signInUser',signInUser);
userRouters.get('/getTopCoursesByEnrollment',getTopCoursesByEnrollment);
userRouters.get('/getCourseById/:courseId',getCourseById);

export default userRouters;