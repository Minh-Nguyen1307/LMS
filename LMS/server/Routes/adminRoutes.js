import express from "express";
import { getAllAdmins, getAllUsers } from "../Controllers/accountsController.js";
import { adminMiddlewares } from "../Middlewares/AdminMiddlewares.js";
import { checkEmailMiddlewares, signUpAdmin } from "../Controllers/signUpControllers.js";
import { signInAdmin } from "../Controllers/signInControllers.js";
import { createCourse, deleteCourseById, getCourses, updateCourseById } from "../Controllers/courseControllers.js";
import upload from "../Middlewares/MulterMiddlewares.js";


const adminRouters = express.Router();
adminRouters.post('/signUpAdmin',checkEmailMiddlewares, signUpAdmin);
adminRouters.post('/signInAdmin',signInAdmin);
adminRouters.get('/getAllUsers', adminMiddlewares, getAllUsers);
adminRouters.get('/getAllAdmins', adminMiddlewares, getAllAdmins);

adminRouters.post('/createCourse', upload.fields([{ name: 'image', maxCount: 1 }]), adminMiddlewares, createCourse);
adminRouters.get('/getCourses', adminMiddlewares, getCourses);
adminRouters.put('/updateCourseById/:courseId',upload.single('image'), adminMiddlewares, updateCourseById);
adminRouters.delete('/deleteCourseById/:courseId', adminMiddlewares, deleteCourseById);

export default adminRouters;