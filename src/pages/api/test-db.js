import { connectDB } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await connectDB(); // Establishes connection

    // Querying the 'staff' collection to fetch all documents
    const staffDocs = await db.connection.db.collection('staff').find().toArray();

    res.status(200).json({
      status: "✅ Fetched staff documents",
      data: staffDocs // Sends back the documents in the 'staff' collection
    });
  } catch (e) {
    res.status(500).json({
      status: "❌ Database connection failed!",
      error: e.message
    });
  }
}
