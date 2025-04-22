import { connectDB } from '../../../lib/db';
import Notification from '../../../models/Notification';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const notifications = await Notification.find()
          .sort({ createdAt: -1 })
          .limit(50);
        res.status(200).json(notifications);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications' });
      }
      break;

    case 'POST':
      try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
      } catch (error) {
        res.status(400).json({ error: 'Error creating notification' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 