import express from 'express'
import { checkEmailMiddlewares, signUpUser } from '../Controllers/signUpControllers.js';
import { signInUser } from '../Controllers/signInControllers.js';
import { getCourseById, getCourses, getTopCoursesByEnrollment } from '../Controllers/courseControllers.js';
import { addToCart, removeFromCart } from '../Controllers/cartControllers.js';
import { getAllCoursesInCart } from '../Models/cartModels.js';
import { capturePayment, createOrder } from '../Controllers/checkoutControllers.js';



const userRouters = express.Router();
userRouters.post('/signUpUser',checkEmailMiddlewares,signUpUser);
userRouters.post('/signInUser',signInUser);
userRouters.get('/getCourses', getCourses);
userRouters.get('/getTopCoursesByEnrollment',getTopCoursesByEnrollment);
userRouters.get('/getCourseById/:courseId',getCourseById);
userRouters.post('/addToCart/:userId',addToCart);
userRouters.delete('/removeFromCart/:userId',removeFromCart)
userRouters.get('/getAllCoursesInCart/:userId',getAllCoursesInCart)
userRouters.post('/createOrder/:userId',createOrder)
userRouters.post('/capturePayment/:userId',capturePayment)

export default userRouters;