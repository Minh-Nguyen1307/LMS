import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true,},
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
  PriceBeforeDiscount: { type: Number, default: 0 },
  PriceDiscount: { type: Number, default: 0 },
  PriceAfterDiscount: { type: Number, default: 0 },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  cartItems: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
});

const CartModels = mongoose.model("cart", cartSchema);

export default CartModels;



export const getAllCoursesInCart = async (req, res, next) => {
  const { userId } = req.params;

  try {

    const cart = await CartModels.findOne({ userId }).populate("cartItems.courseId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

   
    res.status(200).json({
      message: "Cart retrieved successfully",
      cartItems: cart.cartItems,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    next(error);
  }
};
