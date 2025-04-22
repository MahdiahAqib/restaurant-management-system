import { connectDB } from '../../../lib/db';
import Profile from '../../../models/Profile';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const profile = await Profile.findOne({ userId: session.user.id });
        if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(profile);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching profile' });
      }
      break;

    case 'PUT':
      try {
        const profile = await Profile.findOneAndUpdate(
          { userId: session.user.id },
          { ...req.body, updatedAt: Date.now() },
          { new: true, upsert: true }
        );
        res.status(200).json(profile);
      } catch (error) {
        res.status(400).json({ error: 'Error updating profile' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 