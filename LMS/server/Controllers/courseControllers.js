import dotenv from "dotenv";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import CourseModels from "../Models/courseModels.js";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const createCourse = async (req, res, next) => {
    try {
      const { nameCourse, category, author, price, discount, rating, numRatings, level, introduction, enrollmentCount, certification, lessons } = req.body;
      const imageUpload = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: "course_images",
          allowed_formats: ["jpg", "png", "jpeg"],
        }
      );
      const course = new CourseModels({
        nameCourse, category, author, price, discount, rating, numRatings, level, introduction, enrollmentCount, certification,
        lessons: JSON.parse(lessons), 
        image: imageUpload.secure_url, 
      });

      const savedCourse = await course.save();
  
      if (req.files.image) fs.unlinkSync(req.files.image[0].path);
    
      res.status(200).json({
        success: true,
        message: "Course uploaded successfully",
        courseId: savedCourse._id,
        savedCourse
      });
    } catch (error) {
      next(error);
    }
  };

