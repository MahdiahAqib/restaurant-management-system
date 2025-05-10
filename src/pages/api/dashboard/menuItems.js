import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
    try {

        const mongooseConn = await connectDB();
        const db = mongooseConn.connection.db;
        const menuItemCount = await db.collection('menuitems').countDocuments();
        res.status(200).json({
            menuItemCount
          });

    } catch (error) 
    {
        console.error("Menu Item API error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
