import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
    try {

        const mongooseConn = await connectDB();
        const db = mongooseConn.connection.db;
        const staffCount = await db.collection('staff').countDocuments();
        res.status(200).json({
            staffCount
          });

    } catch (error) 
    {
        console.error("Dashboard API error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
