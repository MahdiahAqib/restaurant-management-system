import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by the User model
      isAdmin: true,
    });

    await admin.save();

    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating admin user' });
  }
} 