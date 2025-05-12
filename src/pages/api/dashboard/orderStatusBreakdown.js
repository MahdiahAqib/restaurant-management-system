// pages/api/orders/status.js
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;
    const collection = db.collection('orders');

    // Aggregate order status counts
    const statusCounts = await collection.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Transform the data into a format suitable for the chart
    const statusMap = {
      'completed': 'Completed',
      'pending': 'Pending',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'out for delivery': 'Out for Delivery'
    };

    // Ensure all possible statuses are represented
    const result = Object.entries(statusMap).map(([key, label]) => {
      const foundStatus = statusCounts.find(item => item._id === key);
      return {
        label,
        count: foundStatus ? foundStatus.count : 0
      };
    });

    //console.log("result is: ", result);
    res.status(200).json(result);

  } catch (error) {
    console.error("Order Status API error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
