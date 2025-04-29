import dbConnect from "../../../lib/dbConnect";
import Otp from "../../../models/Otp";
import User from "../../../models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export default async function handler(req, res) {
  await dbConnect();

  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to DB (overwrite previous)
  await Otp.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true });

  const user = await User.findOne({ email });

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });

    res.status(200).json({ success: true, newUser: !user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
