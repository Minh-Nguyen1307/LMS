import UserModels from "../Models/userModels.js";



export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, startTime, endTime, sortBy, sortOrder } = req.query;

    const skip = (page - 1) * limit;

   
    const filter = { role: "user" };

   
    if (startTime || endTime) {
      filter.createdAt = {};
      if (startTime) filter.createdAt.$gte = new Date(startTime); 
      if (endTime) filter.createdAt.$lte = new Date(endTime);   
    }

  
    let sort = {};
    if (sortBy) {
     
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      
      sort.createdAt = -1;
    }

    
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

   
    const filter = { role: "admin" };

    
    if (startTime || endTime) {
      filter.createdAt = {};
      if (startTime) filter.createdAt.$gte = new Date(startTime); 
      if (endTime) filter.createdAt.$lte = new Date(endTime);   
    }

    
    let sort = {};
    if (sortBy) {
     
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      
      sort.createdAt = -1;
    }

    
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
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;  
    const user = await UserModels.findById(userId);  

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user: {
        userId: user._id,  
        userName: user.userName,
        email: user.email,
        avatar: user.avatar, 
        phoneNumber: user.phoneNumber,  
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);}  
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id; 
    const { userName, avatar } = req.body;  

    const user = await UserModels.findById(userId);  

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userName) {
      user.userName = userName;
    }
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        userId: user._id,
        userName: user.userName,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};