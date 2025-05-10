import { connectDB } from '../../../lib/db';
import Notification from '../../../models/Notification';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const { userId, role } = req.query;
        let query = {};

        console.log('Fetching notifications for userId:', userId, 'and role:', role);
        if (role === 'admin') {
          console.log('Admin role detected, fetching all notifications');
          // For admin, show all notifications
          query = {
            $or: [
              { isAdmin: true }, // Admin-specific notifications
              { type: { $in: [
                'reservation_created', 
                'reservation_updated', 
                'reservation_cancelled', 
                'order_received',
                'order_status_changed',
                'new_order'
              ]}}
            ]
          };
        } else if (userId) {
          // For regular users, only show their notifications
          query.userId = userId;
        }

        const notifications = await Notification.find(query)
          .sort({ createdAt: -1 })
          .limit(50);

        res.status(200).json(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
      }
      break;

    case 'POST':
      try {
        const { type, message, userId, reservationId, orderId } = req.body;

        if (!type || !message || !userId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const notification = new Notification({
          type,
          message,
          userId,
          reservationId,
          orderId,
          isRead: false,
        });

        await notification.save();
        res.status(201).json(notification);
      } catch (error) {
        console.error('Error creating notification:', error);
        res.status(400).json({ error: 'Error creating notification' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 