import { connectDB } from '../../../lib/db';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths
} from 'date-fns';

export default async function handler(req, res) {
  try {
    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;
    const { timeframe = 'day', revenueFrame = 'day' } = req.query;

    console.log("revenueFrame: ", revenueFrame)

    // FETCH STAFF COUNT----------------------------------------------------------
    const staffCount = await db.collection('staff').countDocuments();

    // FETCH USER COUNT-----------------------------------------------------------
    const userCount = await db.collection('users').countDocuments();


    // FETCH SALES BY CATEGORY-----------------------------------------------------
    // Calculate date range
    const now = new Date();
    let startDate, endDate, dateRangeLabel;

    switch(timeframe) {
      case 'day':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        dateRangeLabel = `Today (${startDate.toLocaleDateString()})`;
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        dateRangeLabel = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        dateRangeLabel = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        break;
      default:
        return res.status(400).json({ error: 'Invalid timeframe' });
    }

    // Fetch and process orders
    const orders = await db.collection('orders').find({
      orderTime: { $gte: startDate, $lte: endDate },
      status: 'completed'
    }).toArray();

    const itemNames = orders.flatMap(order => order.items.map(item => item.name));
    const uniqueItemNames = [...new Set(itemNames)];
    //console.log("unique names: ", uniqueItemNames)


    const menuItems = await db.collection('menuitems').find({
      name: { $in: uniqueItemNames }
    }).toArray();

    //console.log("item names: ", menuItems)

    // Create category mapping and calculate sales
    const itemNameToCategory = {};
    const categorySales = {};
    let totalRevenue = 0;


    menuItems.forEach(item => {
      itemNameToCategory[item.name] = item.category || 'Unknown';
    });

    //console.log("category name: ", itemNameToCategory)

    orders.forEach(order => {
      order.items.forEach(item => {
        const category = itemNameToCategory[item.name] || 'Unknown';
        const saleAmount = item.price * item.quantity;
        
        categorySales[category] = (categorySales[category] || 0) + saleAmount;
        totalRevenue += saleAmount;
        
        if (!itemNameToCategory[item.name]) {
  
        }
      });
    });

    // FETCH REVENUE TREND-----------------------------------------------------
    const revenueTrend = [];

    if (revenueFrame === 'Today') {
      const dayStart = startOfDay(now); // Start of today (00:00)
      const dayEnd = endOfDay(now);     // End of today (23:59:59)
    
      // Fetch orders that were completed today
      const orders = await db.collection('orders').find({
        orderTime: { $gte: dayStart, $lte: dayEnd },
        status: 'completed'
      }).toArray();
    
      // Calculate total revenue for today
      const revenue = orders.reduce((sum, order) =>
        sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0
      );
    
      revenueTrend.push(revenue); // Push the total revenue for today into the trend
    }   
     
else if (revenueFrame === 'This week') {
  // Daily revenue for this week (Mon–Sun)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    const orders = await db.collection('orders').find({
      orderTime: { $gte: dayStart, $lte: dayEnd },
      status: 'completed'
    }).toArray();

    const revenue = orders.reduce((sum, order) =>
      sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

    revenueTrend.push(revenue);
  }

} else if (revenueFrame === 'This month') {
  // Weekly revenue for this month (approx. 4–5 weeks)
  const monthStart = startOfMonth(now);
  const nextMonth = addMonths(monthStart, 1);
  let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  while (weekStart < nextMonth) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const clampedEnd = weekEnd < nextMonth ? weekEnd : endOfMonth(now);

    const orders = await db.collection('orders').find({
      orderTime: { $gte: weekStart, $lte: clampedEnd },
      status: 'completed'
    }).toArray();

    const revenue = orders.reduce((sum, order) =>
      sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

    revenueTrend.push(revenue);
    weekStart = addWeeks(weekStart, 1);
  }

} else if (revenueFrame === 'This year') {
  // Monthly revenue for current year
  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(now.getFullYear(), month, 1);
    const monthEnd = endOfMonth(monthStart);

    const orders = await db.collection('orders').find({
      orderTime: { $gte: monthStart, $lte: monthEnd },
      status: 'completed'
    }).toArray();

    const revenue = orders.reduce((sum, order) =>
      sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

    revenueTrend.push(revenue);
  }

} else if (revenueFrame === 'Yearly') {
  // Yearly revenue (e.g., 2020–2025)
  const currentYear = now.getFullYear();
  for (let year = currentYear - 5; year <= currentYear; year++) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);

    const orders = await db.collection('orders').find({
      orderTime: { $gte: yearStart, $lte: yearEnd },
      status: 'completed'
    }).toArray();

    const revenue = orders.reduce((sum, order) =>
      sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0), 0);

    revenueTrend.push(revenue);
  }
}

    console.log("revenue trend: ", revenueTrend)

    res.status(200).json({
      staffCount,
      userCount,
      totalRevenue, // Now calculated from all completed orders in the timeframe
      categorySales,
      revenueTrend,
      dateRangeLabel, // Send the pre-formatted date range
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}