import { connectDB } from '../../../lib/db';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
} from 'date-fns';

export default async function handler(req, res) {
  try {
    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;
    const { revenueFrame = 'Today' } = req.query;

    // FETCH REVENUE TREND-----------------------------------------------------
    const revenueTrend = [];
    const now = new Date();

    // Corrected UTC day boundaries function
    const getUTCDayBoundaries = (date) => {
      const utcDate = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      ));
      const start = new Date(utcDate); // 00:00 UTC
      const end = new Date(utcDate);
      end.setUTCHours(23, 59, 59, 999); // 23:59:59.999 UTC
      return { start, end };
    };

    if (revenueFrame === 'Today') {
      // Get today's boundaries in UTC
      const { start: dayStart, end: dayEnd } = getUTCDayBoundaries(now);
      
      console.log("Today UTC Range:", dayStart.toISOString(), "to", dayEnd.toISOString());

      const orders = await db.collection('orders').find({
        orderTime: { $gte: dayStart, $lte: dayEnd },
        status: 'completed'
      }).toArray();
    
      const revenue = orders.reduce((sum, order) =>
        sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0
      );
    
      revenueTrend.push(revenue);
    }  
     
    else if (revenueFrame === 'This week') {
      // Weekly analysis using UTC boundaries
      const weekStartUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - now.getUTCDay() + (now.getUTCDay() === 0 ? -6 : 1) // Monday start
      ));

      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStartUTC, i);
        const { start: dayStart, end: dayEnd } = getUTCDayBoundaries(day);

        const orders = await db.collection('orders').find({
          orderTime: { $gte: dayStart, $lte: dayEnd },
          status: 'completed'
        }).toArray();

        const revenue = orders.reduce((sum, order) =>
          sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

        revenueTrend.push(revenue);
      }
    }

    else if (revenueFrame === 'This month') {
      // Monthly analysis using UTC boundaries
      const monthStartUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        1
      ));
      const nextMonthUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        1
      ));

      let weekStart = startOfWeek(monthStartUTC, { weekStartsOn: 1 });

      while (weekStart < nextMonthUTC) {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const clampedEnd = weekEnd < nextMonthUTC ? weekEnd : endOfMonth(monthStartUTC);

        const orders = await db.collection('orders').find({
          orderTime: { $gte: weekStart, $lte: clampedEnd },
          status: 'completed'
        }).toArray();

        const revenue = orders.reduce((sum, order) =>
          sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

        revenueTrend.push(revenue);
        weekStart = addWeeks(weekStart, 1);
      }
    }

    else if (revenueFrame === 'This year') {
      // Yearly analysis using UTC boundaries
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(Date.UTC(now.getUTCFullYear(), month, 1));
        const monthEnd = new Date(Date.UTC(
          now.getUTCFullYear(),
          month + 1,
          0,
          23, 59, 59, 999
        ));

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
      // Multi-year analysis using UTC boundaries
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