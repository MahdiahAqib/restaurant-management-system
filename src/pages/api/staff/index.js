import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const staff = await db.connection.db
      .collection('staff')
      .find({})
      .sort({ staff_id: 1 }) // Sort by staff ID
      .toArray();

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff data' });
  }
}