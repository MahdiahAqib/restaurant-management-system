import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
});

export default mongoose.model.MenuItem ||
  mongoose.model("MenuItem", menuSchema);
