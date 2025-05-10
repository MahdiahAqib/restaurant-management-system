import { connectDB } from "../../../lib/db";
import Orders from "../../../models/Orders";
import Notification from "../../../models/Notification";
import mongoose from "mongoose";

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
      // Convert string userId to ObjectId
      const orderData = {
        ...req.body,
        userId: new mongoose.Types.ObjectId(req.body.userId)
      };

      const newOrder = await Orders.create(orderData);

      // For Notifications of the user
      const userNotification = await Notification.create({
        type: "order_received",
        message: `Your order has been placed! Total: $${newOrder.totalAmount || 0}. Items: ${newOrder.items?.length || 0}`,
        orderId: newOrder._id,
        userId: newOrder.userId,
        isRead: false,
      });

      // For Admin notification
      const adminNotification = await Notification.create({
        type: "order_received",
        message: `New order received from ${newOrder.customerName}! Total: $${newOrder.totalAmount || 0}. Items: ${newOrder.items?.length || 0}`,
        orderId: newOrder._id,
        isAdmin: true,
        isRead: false,
      });

      console.log('Created notifications:', { userNotification, adminNotification });

      res.status(201).json(newOrder);
    } catch (err) {
      console.error('Error creating order:', err);
      res.status(400).json({ error: err.message || "Failed to create order" });
    }
  }
}
