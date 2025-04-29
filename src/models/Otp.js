import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 mins
});

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
