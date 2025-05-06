import { connectDB } from "../../../lib/db";
import Orders from "../../../models/Orders";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in query" });
    }

    try {
      const orders = await Orders.find({ userId }).sort({ orderTime: -1 });
      res.status(200).json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }


  if (req.method === "POST") {
    const { userId, items, totalAmount } = req.body;

    // Validate required fields
    if (!userId || !items || !totalAmount) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userId", "items", "totalAmount"],
        received: Object.keys(req.body)
      });
    }

    // Process the order data
    const orderData = {
      userId,
      items: items.map(item => ({
        itemId: item.itemId,
        name: item.name || "Unnamed Item",
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || ""
      })),
      totalAmount: Number(totalAmount),
      status: req.body.status || "pending",
      ...(req.body.address && { address: req.body.address }),
      ...(req.body.phone && { phone: req.body.phone }),
      ...(req.body.paymentMethod && { paymentMethod: req.body.paymentMethod }),
      orderTime: new Date()
    };

    try {
      const newOrder = await Orders.create(orderData);
      res.status(201).json(newOrder);
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  // Handle unsupported methods
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
