import express from 'express'
import { checkEmailMiddlewares, signUpUser } from '../Controllers/signUpControllers.js';
import { signInUser } from '../Controllers/signInControllers.js';
import { getCourseById, getCourses, getTopCoursesByEnrollment, searchCoursesByName } from '../Controllers/courseControllers.js';
import { addToCart, getAllCoursesInCart, removeFromCart } from '../Controllers/cartControllers.js';
import {capturePayment, createOrder } from '../Controllers/checkoutControllers.js';
import { getPurchasedCourses } from '../Controllers/PurchasedController.js';
import { userMiddlewares } from '../Middlewares/userMiddlewares.js';
import { getUserById, updateUser } from '../Controllers/accountsController.js';




const userRouters = express.Router();
userRouters.post('/signUpUser',checkEmailMiddlewares,signUpUser);
userRouters.post('/signInUser',signInUser);
userRouters.get('/getCourses', getCourses);
userRouters.get('/getTopCoursesByEnrollment',getTopCoursesByEnrollment);
userRouters.get('/getCourseById/:courseId',getCourseById);
userRouters.post('/addToCart/:userId',addToCart);
userRouters.delete('/removeFromCart/:userId',removeFromCart)
userRouters.get('/getAllCoursesInCart/:userId',getAllCoursesInCart)
userRouters.post('/create-order/:userId',createOrder)
userRouters.get('/capture-payment',capturePayment)
userRouters.get('/:userId/purchased',userMiddlewares, getPurchasedCourses)
userRouters.get('/searchCoursesByName',searchCoursesByName);
userRouters.get('/getUserById/:id',getUserById);
userRouters.put('/updateUser/:id',updateUser);

export default userRouters;