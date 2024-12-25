import UserModels from "../Models/userModels.js";

export const getAllUsers = async (req, res, next) => {
    try {
      const users = await UserModels.find({ "role": "user" });
      const totalUsers = users.length;
      res.status(200).json({
        success: true,
        message: "Get all users successfully.",
        totalUsers,
        users,
      });
    } catch (error) {
      next(error);
    }
  };



  export const getAllAdmins = async (req, res, next) => {
    try {
      const users = await UserModels.find({ "role": "admin" });
      const totalAdmins = users.length;
      res.status(200).json({
        success: true,
        message: "Get all admins successfully.",
        totalAdmins,
        users,
      });
    } catch (error) {
      next(error);
    }
  };
  