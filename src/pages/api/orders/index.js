import { connectDB } from "../../../lib/db";
import Orders from "../../../models/Orders";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const orders = await Orders.find({ userId }).sort({ orderTime: -1 });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  if (req.method === "POST") {
    try {
      const newOrder = await Orders.create(req.body);
      res.status(201).json(newOrder);
    } catch (err) {
      res.status(400).json({ error: "Failed to create order" });
    }
  }
}
