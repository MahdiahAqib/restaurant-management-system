import { connectDB } from '../../lib/db';
import Otp from "../../models/Otp";
import User from "../../models/User";

export default async function handler(req, res) {
  // Establish the DB connection
  console.log("API route reached");
  await connectDB();

  const { email, otp, name } = req.body;
  
  // Find OTP associated with the email
  const foundOtp = await Otp.findOne({ email });

  // Check if OTP is invalid or expired
  if (!foundOtp || foundOtp.otp !== otp) {
    return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
  }

  // Remove OTP after verification
  await Otp.deleteOne({ email });
  const defaultRole = 'User';

  // Find existing user or create new user
  let user = await User.findOne({ email });
  if (!user) {
    if (!name) return res.status(400).json({ success: false, message: "Name is required for new users" });
    user = await User.create({ email, name, role: defaultRole});
  }

  console.log(user)

  // Return success response
  res.status(200).json({ success: true, user: user, });
}
