import { connectDB } from "../../../lib/db";
import MenuItem from "../../../models/MenuItem";

export default async function handler(req, res) {
  // Connect to database
  await connectDB();

  // GET - Fetch all menu items or filter by category
  if (req.method === "GET") {
    try {
      const { category } = req.query;
      const query = category ? { category } : {};
      
      const menuItems = await MenuItem.find(query).sort({ name: 1 });
      res.status(200).json(menuItems);
    } catch (err) {
      console.error("GET Error:", err);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
    return;
  }

  // POST - Create new menu item
  if (req.method === "POST") {
    try {
      // Basic validation
      if (!req.body.name || !req.body.price || !req.body.category) {
        return res.status(400).json({ 
          error: "Name, price and category are required fields" 
        });
      }

      // Create new item
      const newItem = await MenuItem.create({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image || "",
        description: req.body.description || "",
        category: req.body.category
      });

      res.status(201).json(newItem);
    } catch (err) {
      console.error("POST Error:", err);
      res.status(400).json({ 
        error: "Failed to create menu item",
        details: err.message 
      });
    }
    return;
  }

  // PUT - Update existing menu item
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: "Menu item ID is required" });
      }

      const updatedItem = await MenuItem.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          price: req.body.price,
          image: req.body.image,
          description: req.body.description,
          category: req.body.category
        },
        { new: true }
      );

      if (!updatedItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      res.status(200).json(updatedItem);
    } catch (err) {
      console.error("PUT Error:", err);
      res.status(400).json({ 
        error: "Failed to update menu item",
        details: err.message 
      });
    }
    return;
  }

  // DELETE - Remove menu item
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: "Menu item ID is required" });
      }

      const deletedItem = await MenuItem.findByIdAndDelete(id);

      if (!deletedItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      res.status(200).json({ 
        message: "Menu item deleted successfully",
        deletedItem 
      });
    } catch (err) {
      console.error("DELETE Error:", err);
      res.status(500).json({ 
        error: "Failed to delete menu item",
        details: err.message 
      });
    }
    return;
  }

  // Handle unsupported HTTP methods
  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}