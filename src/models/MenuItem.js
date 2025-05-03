import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
});

const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuSchema);

export default MenuItem;