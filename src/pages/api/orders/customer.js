import { connectDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId, limit = 3 } = req.query;

    // Validate userId
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    const db = await connectDB();

    // Check if user exists
    const user = await db.connection.db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch orders
    const orders = await db.connection.db
      .collection("orders")
      .find({ userId: new ObjectId(userId) })
      .sort({ orderTime: -1 })
      .limit(Number(limit))
      .toArray();

    // Format response
    const response = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      orderTime: order.orderTime.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        itemId: item.itemId?.toString(),
      })),
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
