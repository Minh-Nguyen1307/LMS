import UserModels from "../Models/userModels";

export const getAllUsers = async (req, res, next) => {
    try {
      const users = await UserModels.find(); // Exclude password field for security
      
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      next(error);
    }
  };
  