import { connectDB } from '../../../lib/db';
import Reservation from '../../../models/Reservation';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const { date, status } = req.query;
        let query = {};

        if (date) {
          const startDate = new Date(date);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(date);
          endDate.setHours(23, 59, 59, 999);
          query.dateTime = { $gte: startDate, $lte: endDate };
        }

        if (status) {
          query.status = status;
        }

        const reservations = await Reservation.find(query).sort({ dateTime: 1 });
        res.status(200).json(reservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Error fetching reservations' });
      }
      break;

    case 'POST':
      try {
        // Log the request body to verify the incoming data
        console.log('Received reservation data:', req.body);

        // Destructure and validate required fields
        const { name, email, phone, guests, dateTime, tableNumber } = req.body;

        if (!name || !email || !phone || !guests || !dateTime || !tableNumber) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        // Create and save the reservation
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
      } catch (error) {
        console.error('Error creating reservation:', error); // Log the error for debugging
        res.status(400).json({ error: 'Error creating reservation' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
