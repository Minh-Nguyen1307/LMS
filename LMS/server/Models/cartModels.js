import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true,},
  nameCourse: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numRatings: { type: Number, default: 0 },
  level: { type: String, default: "" },
  introduction: { type: String, default: "" },
  enrollmentCount: { type: Number, default: 0 },
  certification: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
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




