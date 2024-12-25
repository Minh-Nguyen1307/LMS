import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    }, // Reference to Course
    lessons: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        videoId: { type: String, required: true },
        duration: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

LessonSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const LessonModels = mongoose.model("lesson", LessonSchema);

export default LessonModels;
