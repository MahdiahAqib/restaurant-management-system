import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;

    // Match only completed orders with paymentMethod 'cash' or 'card'
    const paymentTypeCounts = await db.collection('orders').aggregate([
      {
        $match: {
          status: 'completed',
          paymentMethod: { $in: ['cash', 'card'] } // Only these two
        }
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Format the result
    const responseData = {
      labels: paymentTypeCounts.map(item => item._id),
      counts: paymentTypeCounts.map(item => item.count)
    };

    console.log("Filtered Payment Type Counts:", responseData);
    res.status(200).json(responseData);

  } catch (error) {
    console.error("Payment Type API Error:", error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
