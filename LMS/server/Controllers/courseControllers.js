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
    const {
      nameCourse,
      category,
      author,
      price,
      discount,
      rating,
      numRatings,
      level,
      introduction,
      enrollmentCount,
      certification,
    } = req.body;
    const existingCourse = await CourseModels.findOne({ nameCourse });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "A course with this name already exists.",
      });
    }
    const imageUpload = await cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        folder: "course_images",
        allowed_formats: ["jpg", "png", "jpeg"],
      }
    );
    const course = new CourseModels({
      nameCourse,
      category,
      author,
      price,
      discount,
      rating,
      numRatings,
      level,
      introduction,
      enrollmentCount,
      certification,
      image: imageUpload.secure_url,
    });

    const savedCourse = await course.save();

    if (req.files.image) fs.unlinkSync(req.files.image[0].path);

    res.status(200).json({
      success: true,
      message: "Course uploaded successfully",
      courseId: savedCourse._id,
      savedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const {
      category,
      level,
      rating,
      certification,
      search,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (rating) filter.rating = { $gte: Number(rating) };
    if (certification) filter.certification = certification === "true";
    if (search) filter.nameCourse = { $regex: search, $options: "i" };

    let query = CourseModels.find(filter);

    if (sortBy) {
      const sortOptions = {
        price: { price: 1 },
        "-price": { price: -1 },
        level: { level: 1 },
        "-level": { level: -1 },
        rating: { rating: -1 },
        numRatings: { numRatings: -1 },
        discount: { discount: -1 },
        new: { updatedAt: -1 },
      };
      query = query.sort(sortOptions[sortBy] || {});
    }

    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const courses = await query.exec();

    const totalCourses = await CourseModels.countDocuments(filter);

    res.status(200).json({
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCourses / limit),
        success: true,
        message: "Get all courses successfully.",
        totalCourses,
      },
      courses: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopCoursesByEnrollment = async (req, res, next) => {
  try {
    const courses = await CourseModels.find()
      .sort({ enrollmentCount: -1 })
      .limit(5);
    res.status(200).json({
      success: true,
      message: "Course uploaded successfully",
      allCourses: courses.length,
      topCourses: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await CourseModels.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      course: course,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourseById = async (req, res, next) => {
  try {
    const course = await CourseModels.findByIdAndUpdate(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    let imageUrl = course.image;

    if (req.files && req.files.image) {
      const imageUpload = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: "course_images",
          allowed_formats: ["jpg", "png", "jpeg"],
        }
      );

      imageUrl = imageUpload.secure_url;

      if (course.image) {
      }

      if (req.files.image) fs.unlinkSync(req.files.image[0].path);
    }

    course.set({
      ...req.body,
      image: imageUrl,
    });

    const updatedCourse = await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};
