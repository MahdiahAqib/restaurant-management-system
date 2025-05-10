import { connectDB } from "../../../lib/db";
import Orders from "../../../models/Orders";
import Notification from "../../../models/Notification";

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

    if (!orderId || !status) {
      return res.status(400).json({ 
        message: "Missing required fields",
        details: {
          orderId: !orderId ? "Order ID is required" : null,
          status: !status ? "Status is required" : null
        }
      });
    }

    try {
      // Validate status
      const validStatuses = ['pending', 'preparing', 'ready', 'out for delivery', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status",
          details: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }

      const updatedOrder = await Orders.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ 
          message: "Order not found",
          details: `No order found with ID: ${orderId}`
        });
      }

      // Create notification for order status change
      await Notification.create({
        type: "order_status_changed",
        message: `Order #${orderId.slice(-6).toUpperCase()} status updated to ${status}`,
        orderId: orderId,
        userId: updatedOrder.userId,
        isRead: false,
      });

      // Also create a notification for admin
      await Notification.create({
        type: "order_status_changed",
        message: `Order #${orderId.slice(-6).toUpperCase()} status updated to ${status} for customer ${updatedOrder.customerName}`,
        orderId: orderId,
        isAdmin: true,
        isRead: false,
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ 
        message: "Failed to update order status",
        details: error.message
      });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
