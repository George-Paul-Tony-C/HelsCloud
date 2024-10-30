// src/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
  brand: { type: String },
  tags: [String],
  specifications: [{ key: String, value: String }],
  extraID: { type: String, unique: true }, // Automatically generated ID based on category
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
