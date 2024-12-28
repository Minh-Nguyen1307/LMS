import mongoose from "mongoose";

const purchasedCoursesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
});

const PurchasedCoursesModel = mongoose.model("purchasedCourses", purchasedCoursesSchema);

export default PurchasedCoursesModel;
