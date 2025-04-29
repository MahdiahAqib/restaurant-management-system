import dbConnect from "../../../lib/dbConnect";
import Otp from "../../../models/Otp";
import User from "../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  const { email, otp, name } = req.body;
  const foundOtp = await Otp.findOne({ email });

  if (!foundOtp || foundOtp.otp !== otp) {
    return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
  }

  // Remove OTP after verification
  await Otp.deleteOne({ email });

  let user = await User.findOne({ email });
  if (!user) {
    if (!name) return res.status(400).json({ success: false, message: "Name is required for new users" });
    user = await User.create({ email, name });
  }

  res.status(200).json({ success: true });
}
