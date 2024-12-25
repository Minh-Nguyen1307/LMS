import UserModels from "../Models/userModels.js";

export const checkEmailMiddlewares = async (req, res, next) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      const existedEmail = await UserModels.findOne({ email }); 
  
      if (existedEmail) {
        return res.status(400).json({ message: "Email already exists." });
      }
  
      res.status(200).json({ message: "Email is available.", success: true });
    } catch (error) {
      next(error);
    }
  };