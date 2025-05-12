import { connectDB } from '../../../lib/db';
import { startOfDay, endOfDay, format } from 'date-fns';

export default async function handler(req, res) {
    try {
        const mongooseConn = await connectDB();
        const db = mongooseConn.connection.db;

        // Get today's date range
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        
        //console.log("Start of Today:", todayStart);
        //console.log("End of Today:", todayEnd);

        // Count completed orders today
        const completedOrdersCount = await db.collection('orders').countDocuments({
            status: 'completed',
            orderTime: {
                $gte: todayStart,
                $lte: todayEnd
            }
        });

        res.status(200).json({
            count: completedOrdersCount,
            date: format(new Date(), 'yyyy-MM-dd'),
            start: todayStart,
            end: todayEnd
        });

    } catch (error) {
        console.error("Today's Completed Orders API error:", error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }
}