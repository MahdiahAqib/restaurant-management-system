// /pages/api/send-otp.js
import nodemailer from "nodemailer";
import { connectDB } from "../../lib/db";
import Otp from "../../models/Otp";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  await connectDB();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to database
  await Otp.findOneAndUpdate(
    { email },
    { email, otp },
    { upsert: true, new: true }
  );

  // Check if user already exists
  const isNewUser = !(await import("../../models/User").then(mod => mod.default.findOne({ email })));

  // Send OTP using nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ success: true, newUser: isNewUser });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}
