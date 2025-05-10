import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;

    // Get today's date range in UTC
    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));

    const reservationCount = await db.collection('reservations').countDocuments({
      status: 'confirmed',
      dateTime: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    res.status(200).json({ reservationCount });

  } catch (error) {
    console.error("Menu Item API error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
