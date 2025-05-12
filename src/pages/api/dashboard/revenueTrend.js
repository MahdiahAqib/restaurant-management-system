import { connectDB } from '../../../lib/db';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks
} from 'date-fns';

export default async function handler(req, res) {
  try {
    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;
    const { revenueFrame = 'Today' } = req.query;

    const revenueTrend = [];
    const now = new Date();


    const getPKTDayBoundaries = (pktDate) => {
      const startPKT = new Date(pktDate);
      startPKT.setHours(0, 0, 0, 0);

      const endPKT = new Date(pktDate);
      endPKT.setHours(23, 59, 59, 999);

      // Convert back to UTC by subtracting 5 hours
      const startUTC = new Date(startPKT.getTime() - 5 * 60 * 60 * 1000);
      const endUTC = new Date(endPKT.getTime() - 5 * 60 * 60 * 1000);

      return { startUTC, endUTC };
    };

    if (revenueFrame === 'Today') {
      const pktNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const { startUTC, endUTC } = getPKTDayBoundaries(pktNow);

      console.log("Start of Today:", startUTC);
      console.log("End of Today:", endUTC);

      const orders = await db.collection('orders').find({
        orderTime: { $gte: startUTC, $lte: endUTC },
        status: 'completed'
      }).toArray();

      const revenue = orders.reduce((sum, order) =>
        sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0
      );

      revenueTrend.push(revenue);
    }

    else if (revenueFrame === 'This week') {
      const pktNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const weekStartPKT = startOfWeek(pktNow, { weekStartsOn: 1 });

      for (let i = 0; i < 7; i++) {
        const dayPKT = addDays(weekStartPKT, i);
        const { startUTC, endUTC } = getPKTDayBoundaries(dayPKT);

        const orders = await db.collection('orders').find({
          orderTime: { $gte: startUTC, $lte: endUTC },
          status: 'completed'
        }).toArray();

        const revenue = orders.reduce((sum, order) =>
          sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

        revenueTrend.push(revenue);
      }
    }

    else if (revenueFrame === 'This month') {
      const pktNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const monthStartPKT = startOfMonth(pktNow);
      const monthEndPKT = endOfMonth(pktNow);

      let weekStartPKT = startOfWeek(monthStartPKT, { weekStartsOn: 1 });

      while (weekStartPKT < monthEndPKT) {
        const weekEndPKT = endOfWeek(weekStartPKT, { weekStartsOn: 1 });
        const clampedEndPKT = weekEndPKT > monthEndPKT ? monthEndPKT : weekEndPKT;

        // Convert weekStart and clampedEnd to UTC
        const startUTC = new Date(weekStartPKT.getTime() - 5 * 60 * 60 * 1000);
        const endUTC = new Date(clampedEndPKT.getTime() - 5 * 60 * 60 * 1000 + (23 * 60 + 59) * 60 * 1000 + 999);

        const orders = await db.collection('orders').find({
          orderTime: { $gte: startUTC, $lte: endUTC },
          status: 'completed'
        }).toArray();

        const revenue = orders.reduce((sum, order) =>
          sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

        revenueTrend.push(revenue);
        weekStartPKT = addWeeks(weekStartPKT, 1);
      }
    }

    else if (revenueFrame === 'This year') {
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(Date.UTC(now.getUTCFullYear(), month, 1));
        const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), month + 1, 0, 23, 59, 59, 999));

        const orders = await db.collection('orders').find({
          orderTime: { $gte: monthStart, $lte: monthEnd },
          status: 'completed'
        }).toArray();

        const revenue = orders.reduce((sum, order) =>
          sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

        revenueTrend.push(revenue);
      }
    }

    else if (revenueFrame === 'Yearly') {
      const currentYear = now.getUTCFullYear();
      for (let year = currentYear - 5; year <= currentYear; year++) {
        const yearStart = new Date(Date.UTC(year, 0, 1));
        const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

        const orders = await db.collection('orders').find({
          orderTime: { $gte: yearStart, $lte: yearEnd },
          status: 'completed'
        }).toArray();

        const revenue = orders.reduce((sum, order) =>
          sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

        revenueTrend.push(revenue);
      }
    }

    res.status(200).json({
      revenueTrend,
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
