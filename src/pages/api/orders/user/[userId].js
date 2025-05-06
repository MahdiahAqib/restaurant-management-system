import { connectDB } from "../../../../lib/db";
import Orders from "../../../../models/Orders";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (req.method === "GET") {
    try {
      const orders = await Orders.find({ userId }).sort({ orderTime: -1 });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
