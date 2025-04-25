import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const db = await connectDB();
    
    const result = await db.connection.db.collection('staff').deleteOne({ staff_id: id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff member', error: error.message });
  }
}