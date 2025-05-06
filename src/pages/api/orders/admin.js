import { connectDB } from "../../../lib/db";
import Orders from "../../../models/Orders";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const currentOrders = await Orders.find({
        status: { $ne: "completed" },
      }).sort({ orderTime: -1 });
      const orderHistory = await Orders.find({ status: "completed" })
        .sort({ orderTime: -1 })
        .limit(20);

      return res.status(200).json({ currentOrders, orderHistory });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to fetch orders.", error });
    }
  }

  if (req.method === "PATCH") {
    const { orderId, status } = req.body;

    try {
      const updatedOrder = await Orders.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to update order status.", error });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
