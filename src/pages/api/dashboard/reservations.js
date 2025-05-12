import { connectDB } from '../../../lib/db';
import { startOfDay, endOfDay } from 'date-fns';

export default async function handler(req, res) {
    try {
        const mongooseConn = await connectDB();
        const db = mongooseConn.connection.db;

        // Get current UTC time and convert to Pakistan Standard Time (UTC+5)
        const nowUTC = new Date();

        //console.log("Current PST Time:", nowPST);

        // Get start and end of day in PST
        //const startOfPSTDay = startOfDay(nowPST);
        //const endOfPSTDay = endOfDay(nowPST);

        const startUTC = startOfDay(nowUTC);
        const endUTC = endOfDay(nowUTC);

        //console.log("Start of UTC Day:", startUTC);
        //console.log("End of UTC Day:", endUTC);

        const count = await db.collection('reservations').countDocuments({
            dateTime: {
                $gte: startUTC,
                $lte: endUTC
            }
        });

        res.status(200).json({ count });

    } catch (error) {
        console.error("Today's Completed Orders API error:", error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }
}
