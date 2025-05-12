import { connectDB } from '../../../lib/db';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default async function handler(req, res) {
  try {
    const mongooseConn = await connectDB();
    const db = mongooseConn.connection.db;
    const { timeframe = 'day' } = req.query;

    // Get current date in pure UTC (ignoring local timezone)
    const nowUTC = new Date();
    const currentUTCDate = new Date(Date.UTC(
      nowUTC.getUTCFullYear(),
      nowUTC.getUTCMonth(),
      nowUTC.getUTCDate()
    ));

    let startDate, endDate, dateRangeLabel;

    switch (timeframe) {
      case 'day':
        // Fixed UTC boundaries (00:00 to 23:59 UTC)
        startDate = new Date(currentUTCDate); // 00:00 UTC
        endDate = new Date(currentUTCDate);
        endDate.setUTCHours(23, 59, 59, 999); // 23:59:59.999 UTC
        
        dateRangeLabel = `Today (${startDate.toISOString().split('T')[0]})`;
        break;

      case 'week':
        startDate = startOfWeek(currentUTCDate, { weekStartsOn: 1 });
        endDate = endOfWeek(currentUTCDate, { weekStartsOn: 1 });
        dateRangeLabel = `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`;
        break;

      case 'month':
        startDate = startOfMonth(currentUTCDate);
        endDate = endOfMonth(currentUTCDate);
        dateRangeLabel = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        break;

      default:
        return res.status(400).json({ error: 'Invalid timeframe' });
    }

    //console.log("UTC Start Date:", startDate.toISOString());
    //console.log("UTC End Date:", endDate.toISOString());

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