import { connectDB } from "../../../lib/db";
import MenuItem from "../../../models/MenuItem";

export default async function handler(req, res) {
  await connectDB();

  // GET - Fetch all menu items or categories
  if (req.method === "GET") {
    try {
      const { category, featured, getCategories } = req.query;
      
      if (getCategories) {
        // Return distinct categories
        const categories = await MenuItem.distinct("category");
        return res.status(200).json(categories);
      }
      
      let query = {};
      if (category) query.category = category;
      if (featured) query.featured = true;
      
      const menuItems = await MenuItem.find(query).sort({ 
        featured: -1,
        name: 1 
      });
      res.status(200).json(menuItems);
    } catch (err) {
      console.error("GET Error:", err);
      res.status(500).json({ error: "Failed to fetch data" });
    }
    return;
  }

  // POST - Create new menu item or category
  if (req.method === "POST") {
    try {
      // Handle category creation
      if (req.body.action === "createCategory") {
        if (!req.body.categoryName) {
          return res.status(400).json({ error: "Category name is required" });
        }
        
        // Check if category already exists
        const existingCategory = await MenuItem.findOne({ 
          category: req.body.categoryName 
        });
        
        if (existingCategory) {
          return res.status(400).json({ error: "Category already exists" });
        }
        
        return res.status(201).json({ 
          message: "Category created successfully",
          category: req.body.categoryName
        });
      }

      // Original menu item creation logic
      if (!req.body.name || !req.body.price || !req.body.category) {
        return res.status(400).json({ 
          error: "Name, price and category are required fields" 
        });
      }

      const newItem = await MenuItem.create({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image || "/images/default-food.jpg",
        description: req.body.description || "",
        category: req.body.category,
        featured: req.body.featured || false
      });

      res.status(201).json(newItem);
    } catch (err) {
      console.error("POST Error:", err);
      res.status(400).json({ 
        error: "Failed to create item",
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
          category: req.body.category,
          featured: req.body.featured
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

  // DELETE - Remove menu item or category
  if (req.method === "DELETE") {
    try {
      const { id, category } = req.query;
      
      if (category) {
        // Delete all items in this category
        await MenuItem.deleteMany({ category });
        return res.status(200).json({ 
          message: `Category "${category}" and all its items deleted successfully`
        });
      }
      
      if (!id) {
        return res.status(400).json({ error: "ID or category is required" });
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
        error: "Failed to delete",
        details: err.message 
      });
    }
    return;
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}