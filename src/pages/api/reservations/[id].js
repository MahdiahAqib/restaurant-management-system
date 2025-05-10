import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import Reservation from '../../../models/Reservation';
import { connectDB } from '../../../lib/db';
import { MongoClient } from 'mongodb';

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db();
}

async function isAdmin(email) {
  const db = await connectToDatabase();
  const admin = await db.collection('admin').findOne({ email });
  return !!admin;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Debug logging
  console.log('Session data:', {
    user: session.user,
    email: session.user?.email
  });

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Reservation ID is required' });
  }

  await connectDB();

  try {
    switch (req.method) {
      case 'GET':
        const reservation = await Reservation.findById(id);
        if (!reservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
        return res.status(200).json(reservation);

      case 'PUT':
        const { status } = req.body;
        if (!status) {
          return res.status(400).json({ error: 'Status is required' });
        }

        const validStatuses = ['pending', 'confirmed', 'cancelled'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

        if (!updatedReservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }

        return res.status(200).json(updatedReservation);

      case 'DELETE':
        // Check if user is admin by querying the database
        const adminStatus = await isAdmin(session.user.email);
        
        if (!adminStatus) {
          console.log('Admin check failed:', {
            email: session.user.email,
            isAdmin: adminStatus
          });
          return res.status(403).json({ 
            error: 'Only admins can delete reservations',
            debug: {
              email: session.user.email,
              isAdmin: adminStatus
            }
          });
        }

        const deletedReservation = await Reservation.findByIdAndDelete(id);
        
        if (!deletedReservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }

        return res.status(200).json({ message: 'Reservation deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Reservation API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 