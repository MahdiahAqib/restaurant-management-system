import { connectDB } from '../../../lib/db';
import Reservation from '../../../models/Reservation';
import Notification from '../../../models/Notification';
import mongoose from 'mongoose';

// Helper function to find available table
async function findAvailableTable(dateTime, guests) {
  // Get all reservations for the same date and time
  const startTime = new Date(dateTime);
  const endTime = new Date(dateTime);
  endTime.setHours(endTime.getHours() + 2); // Assuming 2-hour dining duration

  const existingReservations = await Reservation.find({
    dateTime: {
      $gte: startTime,
      $lt: endTime
    },
    status: { $ne: 'cancelled' }
  });

  // Get all occupied tables
  const occupiedTables = existingReservations.map(res => res.tableNumber);
  
  // Find the first available table
  let tableNumber = 1;
  while (occupiedTables.includes(tableNumber)) {
    tableNumber++;
  }

  return tableNumber;
}

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
        const { name, email, phone, guests, dateTime, userId } = req.body;

        if (!name || !email || !phone || !guests || !dateTime || !userId) {
          return res.status(400).json({ 
            error: 'Missing required fields',
            details: {
              name: !name ? 'Name is required' : null,
              email: !email ? 'Email is required' : null,
              phone: !phone ? 'Phone is required' : null,
              guests: !guests ? 'Number of guests is required' : null,
              dateTime: !dateTime ? 'Date and time is required' : null,
              userId: !userId ? 'User ID is required' : null
            }
          });
        }

        // Find an available table
        const tableNumber = await findAvailableTable(dateTime, guests);

        // Create and save the reservation with the allocated table
        const reservation = new Reservation({
          ...req.body,
          tableNumber,
          status: 'confirmed'
        });
        await reservation.save();

        // Ensure we have a valid user ID
        const userIdForNotification = reservation.userId || req.body.userId;
        if (!userIdForNotification) {
          console.error('No user ID available for notification');
          return res.status(400).json({ error: 'User ID is required for notification' });
        }

        // Create a notification for the user
        const userNotification = await Notification.create({
          type: "reservation_created",
          message: `Your reservation is confirmed for ${reservation.guests} guests on ${new Date(reservation.dateTime).toLocaleString()} at table ${reservation.tableNumber}.`,
          reservationId: reservation._id,
          userId: userIdForNotification,
          isRead: false,
        });

        // Create a notification for the admin
        const adminNotification = await Notification.create({
          type: "reservation_created",
          message: `New reservation from ${reservation.name} for ${reservation.guests} guests on ${new Date(reservation.dateTime).toLocaleString()} at table ${reservation.tableNumber}.`,
          reservationId: reservation._id,
          isAdmin: true,
          isRead: false,
        });

        console.log('Created notifications:', { 
          userNotification: userNotification._id,
          adminNotification: adminNotification._id,
          userId: userIdForNotification
        });

        res.status(201).json(reservation);
      } catch (error) {
        console.error('Error creating reservation:', error);
        // Send more detailed error message
        res.status(400).json({ 
          error: 'Error creating reservation',
          details: error.message,
          validationErrors: error.errors
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
