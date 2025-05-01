// api/staff/count.js
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const count = await db.connection.db
      .collection('staff')
      .countDocuments({});
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff count' });
  }
}