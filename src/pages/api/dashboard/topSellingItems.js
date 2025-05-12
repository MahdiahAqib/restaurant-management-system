import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
    try {
        const mongooseConn = await connectDB();
        const db = mongooseConn.connection.db;
        const ordersCollection = db.collection('orders');

        // Convert aggregation cursor to array first
        const aggregationCursor = ordersCollection.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalOrders: { $sum: "$items.quantity" },
                    totalRevenue: { 
                        $sum: { 
                            $multiply: ["$items.price", "$items.quantity"] 
                        } 
                    }
                }
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 5 }
        ]);

        // Convert cursor to array
        const topItems = await aggregationCursor.toArray();

        // Format the response
        const result = topItems.map(item => ({
            name: item._id,
            orders: item.totalOrders,
            revenue: parseFloat(item.totalRevenue.toFixed(2)) // Format to 2 decimal places
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error("Top Selling Items API error:", error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }
}