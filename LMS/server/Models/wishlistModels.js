import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
});

const WishlistModel = mongoose.model("wishlist", wishlistSchema);

export default WishlistModel;
