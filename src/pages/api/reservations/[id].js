import { connectDB } from '../../../lib/db';
import Reservation from '../../../models/Reservation';

export default async function handler(req, res) {
  const { id } = req.query;
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(reservation);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching reservation' });
      }
      break;

    case 'PUT':
      try {
        const reservation = await Reservation.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: Date.now() },
          { new: true, runValidators: true }
        );
        if (!reservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(reservation);
      } catch (error) {
        res.status(400).json({ error: 'Error updating reservation' });
      }
      break;

    case 'DELETE':
      try {
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting reservation' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 