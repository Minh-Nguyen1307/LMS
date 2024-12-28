import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model("notification", notificationSchema);

export default NotificationModel;
