import PurchasedCoursesModel from "../Models/PurchasedCoursesModel.js";

export const getPurchasedCourses = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = 5; 
    const skip = (page - 1) * limit; 

    
    const purchasedCourses = await PurchasedCoursesModel.findOne({ userId })
      .populate("courses", "nameCourse introduction category level")  
      .skip(skip)  
      .limit(limit)  
      .exec();

    if (!purchasedCourses) {
      return res.status(404).json({ message: "No purchased courses found for this user." });
    }

   
    const totalCourses = purchasedCourses.courses.length;

 
    const coursesWithId = purchasedCourses.courses.map(course => ({
      courseId: course._id, 
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
