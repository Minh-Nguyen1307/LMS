import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  nameCourse: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  numRatings: { type: Number, required: true, default: 0 },
  level: { type: String, required: true },
  introduction: { type: String, required: true },
  enrollmentCount: { type: Number, required: true, default: 0 },
  certification: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CourseModels = mongoose.model("course", courseSchema);
export default CourseModels;
