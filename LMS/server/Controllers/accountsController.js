import UserModels from "../Models/userModels.js";



export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, startTime, endTime, sortBy, sortOrder } = req.query;

    const skip = (page - 1) * limit;

    // Build the filter object dynamically
    const filter = { role: "user" };

    // Add time filtering if `startTime` or `endTime` is provided
    if (startTime || endTime) {
      filter.createdAt = {};
      if (startTime) filter.createdAt.$gte = new Date(startTime); 
      if (endTime) filter.createdAt.$lte = new Date(endTime);   
    }

    // Set up the sorting
    let sort = {};
    if (sortBy) {
      // Default sort by 'createdAt'
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default to sort by 'createdAt' in descending order
      sort.createdAt = -1;
    }

    // Fetch the users with dynamic filters and sorting
    const users = await UserModels.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sort);

    const totalUsers = await UserModels.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Get all users successfully.",
      totalUsers,
      page: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, startTime, endTime, sortBy, sortOrder } = req.query;

    const skip = (page - 1) * limit;

    // Build the filter object dynamically
    const filter = { role: "admin" };

    // Add time filtering if `startTime` or `endTime` is provided
    if (startTime || endTime) {
      filter.createdAt = {};
      if (startTime) filter.createdAt.$gte = new Date(startTime); 
      if (endTime) filter.createdAt.$lte = new Date(endTime);   
    }

    // Set up the sorting
    let sort = {};
    if (sortBy) {
      // Default sort by 'createdAt'
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default to sort by 'createdAt' in descending order
      sort.createdAt = -1;
    }

    // Fetch the users with dynamic filters and sorting
    const users = await UserModels.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sort);

    const totalAdmins = await UserModels.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Get all admins successfully.",
      totalAdmins,
      page: Number(page),
      totalPages: Math.ceil(totalAdmins / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};


  