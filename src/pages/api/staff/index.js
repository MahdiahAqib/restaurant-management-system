import { connectDB } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Existing GET handler
    try {
      const db = await connectDB();
      const staff = await db.connection.db
        .collection("staff")
        .find({})
        .sort({ staff_id: 1 })
        .toArray();

      res.status(200).json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff data" });
    }
  } else if (req.method === "POST") {
    // New POST handler for adding staff
    try {
      const db = await connectDB();
      const staffCollection = db.connection.db.collection("staff");

      // Get the last staff ID to generate a new one
      const lastStaff = await staffCollection
        .find()
        .sort({ staff_id: -1 })
        .limit(1)
        .toArray();

      const lastId = lastStaff[0]?.staff_id || "S-000";
      const newIdNumber = parseInt(lastId.split("-")[1]) + 1;
      const newStaffId = `S-${newIdNumber.toString().padStart(3, "0")}`;

      const newStaff = {
        ...req.body,
        staff_id: newStaffId,
        created_at: new Date(),
      };

      const result = await staffCollection.insertOne(newStaff);

      res.status(201).json({
        ...newStaff,
        _id: result.insertedId,
      });
    } catch (error) {
      console.error("Error adding staff:", error);
      res.status(500).json({ error: "Failed to add staff member" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
