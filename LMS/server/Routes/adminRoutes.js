import express from "express";
import { getAllAdmins, getAllUsers } from "../Controllers/accountsController.js";
import { adminMiddlewares } from "../Middlewares/AdminMiddlewares.js";
import { checkEmailMiddlewares, signUpAdmin } from "../Controllers/signUpControllers.js";
import { signInAdmin } from "../Controllers/signInControllers.js";
import { createCourse } from "../Controllers/courseControllers.js";


const adminRouters = express.Router();
adminRouters.post('/signUpAdmin',checkEmailMiddlewares, signUpAdmin);
adminRouters.post('/signInAdmin',signInAdmin);
adminRouters.get('/getAllUsers', adminMiddlewares, getAllUsers);
adminRouters.get('/getAllAdmins', adminMiddlewares, getAllAdmins);
adminRouters.get('/createCourse', adminMiddlewares, createCourse);
export default adminRouters;