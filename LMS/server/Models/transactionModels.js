import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
});

const TransactionModel = mongoose.model("transaction", transactionSchema);

export default TransactionModel;
