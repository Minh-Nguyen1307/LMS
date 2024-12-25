import bcrypt from "bcryptjs";
import UserModels from "../Models/userModels.js";


export const checkEmailUser = async (req, res, next) => {
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

  export const signUpUser = async (req, res, next) => {
    try {
      const { userName, email, password } = req.body;
  
      if (!userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = await UserModels.create({
        userName,
        email,
        password: hashedPassword,
      });
  
      res.status(201).json({
        message: "Registration successful!",
        userId: newUser._id,
        user:{
            userName: newUser.userName,
            email: newUser.email,
            role: newUser.role,
        },
        createdAt: newUser.createdAt, 
        updatedAt: newUser.updatedAt, 
        success: true,
       
      });
    } catch (error) {
      next(error);
    }
  };

  export const signUpAdmin = async (req, res, next) => {
    const { userName, email, password, secretKey } = req.body;
  
  
    const adminSecretKey = process.env.ADMIN_SECRET_KEY;
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (secretKey !== adminSecretKey) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid secret key. Access denied.' 
      });
    }
  
    try {
      const newAdmin = new UserModels({
        userName,
        email,
        password: hashedPassword,
        role: 'admin',
        
      });
  
      await newAdmin.save();
      res.status(201).json({
        success: true,
        message: 'Admin account created successfully.',
        userId: newAdmin._id,
        user:{
          userName: newAdmin.userName,
          email: newAdmin.email,
          role: newAdmin.role,
          password: newAdmin.password,
          createdAt: newAdmin.createdAt, 
          updatedAt: newAdmin.updatedAt, 
        },
      });
    } catch (error) {
      next(error);
    }
  };