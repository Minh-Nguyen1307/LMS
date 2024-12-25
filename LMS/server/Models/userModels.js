import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  avatar: { type: String, default: "" },
  phoneNumber: { type: String, trim: true },
  cart: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true,
      },
      quantity: { type: Number, default: 1 },
      addedAt: { type: Date, default: Date.now },
      PriceBeforeDiscount: { type: Number, default: 0 },
      PriceDiscount: { type: Number, default: 0 },
      PriceAfterDiscount: { type: Number, default: 0 },
    },
    { totalPrice: { type: Number, default: 0 } },
  ],
  transactionHistory: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      course: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
    },
  ],
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  notifications: [
    {
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],
  reviewsGiven: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
      reviewText: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
const UserModels = mongoose.model("user", userSchema);
export default UserModels;
