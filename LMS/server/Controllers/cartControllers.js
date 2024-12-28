import CartModels from "../Models/cartModels.js";
import CourseModels from "../Models/courseModels.js";
import UserModels from "../Models/userModels.js";
import dotenv from "dotenv";
dotenv.config();

export const addToCart = async (req, res, next) => {
  const { userId } = req.params;
  const { courseId } = req.body;

  try {
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    let cart = await CartModels.findOne({ userId });

    if (!cart) {
      cart = new CartModels({
        userId,
        cartItems: [],
        totalPrice: 0,
      });
    }

    const user = await UserModels.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const course = await CourseModels.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if course is already in the cart
    const existingCartItem = cart.cartItems.find(
      (cartItem) => cartItem.courseId.toString() === course._id.toString()
    );

    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "The course is already in the cart" });
    }

    // Calculate prices
    const priceBeforeDiscount = course.price || 0;
    const priceDiscount = course.price * (course.discount || 0) / 100;
    const priceAfterDiscount = priceBeforeDiscount - priceDiscount;

    // Add the course to the cart with all the necessary details
    cart.cartItems.push({
      courseId: course._id,
      nameCourse: course.nameCourse,
      category: course.category,
      image: course.image,
      author: course.author,
      price: priceBeforeDiscount,
      discount: course.discount,
      rating: course.rating,
      numRatings: course.numRatings,
      level: course.level,
      introduction: course.introduction,
      enrollmentCount: course.enrollmentCount,
      certification: course.certification,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      PriceBeforeDiscount: priceBeforeDiscount,
      PriceDiscount: priceDiscount,
      PriceAfterDiscount: priceAfterDiscount,
      quantity: 1,
      addedAt: new Date(),
    });

    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.PriceAfterDiscount * item.quantity,
      0
    );

    const updatedCart = await cart.save();

    res.status(200).json({
      message: "Course added to cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};





export const removeFromCart = async (req, res, next) => {
  const { userId } = req.params; 
  const { courseId } = req.body; 

  try {
   
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const cart = await CartModels.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item.courseId.toString() === courseId.toString()
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Course not found in the cart" });
    }

    cart.cartItems.splice(cartItemIndex, 1);

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.PriceAfterDiscount * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      message: "Course removed from cart successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
