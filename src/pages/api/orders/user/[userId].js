import { connectDB } from "../../../../lib/db";
import Orders from "../../../../models/Orders";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    switch (req.method) {
      case "GET":
        const orders = await Orders.find({ userId }).sort({ orderTime: -1 });
        return res.status(200).json(orders);

      case "POST":
        const orderData = {
          ...req.body,
          userId, // Ensure userId is included from the route
        };

        // Validate required fields
        if (!orderData.items || !orderData.items.length) {
          return res.status(400).json({ error: "Order items are required" });
        }
        if (!orderData.address) {
          return res
            .status(400)
            .json({ error: "Delivery address is required" });
        }
        if (!orderData.phone) {
          return res.status(400).json({ error: "Phone number is required" });
        }

        const order = new Orders(orderData);
        const savedOrder = await order.save();
        return res.status(201).json(savedOrder);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
