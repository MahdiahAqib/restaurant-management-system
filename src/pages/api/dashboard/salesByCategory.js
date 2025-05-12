import { connectDB } from '../../../lib/db';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default async function handler(req, res) {
  try {
    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;
    const { timeframe = 'day' } = req.query;

    // Get current date in UTC
    const nowUTC = new Date();

    let startDate, endDate, dateRangeLabel;

    switch (timeframe) {
      case 'day':
        startDate = startOfDay(nowUTC);
        endDate = endOfDay(nowUTC);
        // Add 5 hours to convert from UTC to PKT (Pakistan Standard Time)
        const startDatePKT = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // Add 5 hours for PKT
        dateRangeLabel = `Today (${startDatePKT.toISOString().split('T')[0]})`;
        break;

      case 'week':
        startDate = startOfWeek(nowUTC, { weekStartsOn: 1 });
        endDate = endOfWeek(nowUTC, { weekStartsOn: 1 });

        // Convert to PKT (UTC +5)
        const startDatePKTWeek = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);
        const endDatePKTWeek = new Date(endDate.getTime() + 5 * 60 * 60 * 1000);

        dateRangeLabel = `${startDatePKTWeek.toISOString().split('T')[0]} - ${endDatePKTWeek.toISOString().split('T')[0]}`;
        break;

      case 'month':
        // Use nowUTC for 'month' timeframe
        startDate = startOfMonth(nowUTC);
        endDate = endOfMonth(nowUTC);

        // Convert to PKT for label
        const startDatePKTMonth = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);
        dateRangeLabel = startDatePKTMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        break;


      default:
        return res.status(400).json({ error: 'Invalid timeframe' });
    }

    // Fetch orders within the UTC date range
    const orders = await db.collection('orders').find({
      orderTime: { $gte: startDate, $lte: endDate },
      status: 'completed'
    }).toArray();

    // Extract item names from completed orders
    const itemNames = orders.flatMap(order => order.items.map(item => item.name));
    const uniqueItemNames = [...new Set(itemNames)];

    // Fetch the menu items for the unique items in the completed orders
    const menuItems = await db.collection('menuitems').find({
      name: { $in: uniqueItemNames }
    }).toArray();

    // Map menu items to categories and calculate sales
    const itemNameToCategory = {};
    const categorySales = {};
    let totalRevenue = 0;

    // Assign categories to items
    menuItems.forEach(item => {
      itemNameToCategory[item.name] = item.category || 'Unknown';
    });

    // Calculate sales for each category from the completed orders
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = itemNameToCategory[item.name] || 'Unknown';
        const saleAmount = item.price * item.quantity;

        categorySales[category] = (categorySales[category] || 0) + saleAmount;
        totalRevenue += saleAmount;
      });
    });

    // Return the sales data and date range label as response
    res.status(200).json({
      categorySales,
      totalRevenue,
      dateRangeLabel,
      orderCount: orders.length // Optional: Include count of orders
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
}
