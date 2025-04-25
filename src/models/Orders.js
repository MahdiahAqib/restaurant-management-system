import mongoose, { Mongoose } from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "true",
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: "true",
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "out for delivery", "completed"],
    default: "pending",
  },
  inHouse: { type: Boolean, default: false },
  tableNo: Number,
  totalAmount: Number,
  orderTime: { type: Date, default: Date.now },
});

export default mongoose.models.Orders || mongoose.model("Orders", orderSchema);
