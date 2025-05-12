import { connectDB } from '../../../lib/db';
import { startOfDay, endOfDay } from 'date-fns';

export default async function handler(req, res) {
    try {
        const mongooseConn = await connectDB();
        const db = mongooseConn.connection.db;

        // Get the current time in UTC
        const nowUTC = new Date();

        // Get the start and end of the day
        const startOfPSTDay = startOfDay(nowUTC);
        const endOfPSTDay = endOfDay(nowUTC);

        //console.log("Start of PST Day:", startOfPSTDay);
        //console.log("End of PST Day:", endOfPSTDay);

        // Fetch completed orders from the reservations collection
        const orders = await db.collection('orders').aggregate([
            {
                $match: {
                    orderTime: { $gte: startOfPSTDay, $lt: endOfPSTDay }, // Filter by today's date in PST
                    status: 'completed', // Only completed orders
                },
            },
            {
                $group: {
                    _id: null, // No grouping needed, just sum total amount
                    totalRevenue: { $sum: '$totalAmount' }, // Sum of the totalAmount for the completed orders
                },
            },
        ]).toArray();

        //console.log("Today's Revenue:", orders);

        // Return the total revenue
        if (orders.length > 0) {
            res.status(200).json({
                totalRevenue: orders[0].totalRevenue,
            });
        } else {
            res.status(200).json({
                totalRevenue: 0,
            });
        }
    } catch (error) {
        console.error("Today's Revenue API error:", error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
}
