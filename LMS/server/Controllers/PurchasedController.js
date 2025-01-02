import PurchasedCoursesModel from "../Models/PurchasedCoursesModel.js";

export const getPurchasedCourses = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1; // Get page from query params, default to 1 if not provided
    const limit = 5; // Maximum 5 courses per page
    const skip = (page - 1) * limit; // Skip the appropriate number of courses based on the current page

    // Find the user's purchased courses
    const purchasedCourses = await PurchasedCoursesModel.findOne({ userId })
      .populate("courses", "nameCourse introduction category level")  // Populate course details
      .skip(skip)  // Skip courses for pagination
      .limit(limit)  // Limit to 5 courses per page
      .exec();

    if (!purchasedCourses) {
      return res.status(404).json({ message: "No purchased courses found for this user." });
    }

    // Calculate the total number of courses (for pagination info)
    const totalCourses = purchasedCourses.courses.length;

    // Add courseId for each course in the response
    const coursesWithId = purchasedCourses.courses.map(course => ({
      courseId: course._id,  // Adding courseId
      nameCourse: course.nameCourse,
      introduction: course.introduction,
      category: course.category,
      level: course.level,
    }));

    
    res.status(200).json({
      totalCourses,       
      courses: coursesWithId,  
      page,              
      totalPages: Math.ceil(totalCourses / limit),
    });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    next(error);
  }
};
