import { connectDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { search } = req.query;
      const db = await connectDB();

      let query = {};

      if (search) {
        query = {
          email: { $regex: search, $options: "i" },
        };
      }

      const customers = await db.connection.db
        .collection("users")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      res.status(200).json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
