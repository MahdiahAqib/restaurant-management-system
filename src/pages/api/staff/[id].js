import { connectDB } from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const db = await connectDB();

    switch (req.method) {
      case "PUT":
        // Handle PUT (update) request
        const { salary, timings } = req.body;

        if (!salary || !timings) {
          return res
            .status(400)
            .json({ error: "Salary and timings are required" });
        }

        const updateResult = await db.connection.db
          .collection("staff")
          .updateOne(
            { staff_id: id },
            { $set: { salary: Number(salary), timings } }
          );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: "Staff member not found" });
        }

        return res
          .status(200)
          .json({ message: "Staff member updated successfully" });

      case "DELETE":
        // Handle DELETE request
        const deleteResult = await db.connection.db
          .collection("staff")
          .deleteOne({ staff_id: id });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: "Staff member not found" });
        }

        return res
          .status(200)
          .json({ message: "Staff member deleted successfully" });

      default:
        // Handle any other HTTP methods
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(`Error in staff API (${req.method}):`, error);
    return res
      .status(500)
      .json({ error: `Failed to process ${req.method} request` });
  }
}
