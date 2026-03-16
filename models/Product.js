// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    category: { type: String, default: "tshirt" },
    aboutItems: { type: [String], default: [] },
    reviewsCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    customersSay: {
      type: [
        {
          text: { type: String, required: true },
          reviewer: { type: String, default: "Anonymous" },
          image: { type: String, default: "" },
          rating: { type: Number, default: 5 },
          createdAt: { type: Date, default: Date.now }
        },
      ],
      default: [],
    },
    replacementPolicy: { type: String, default: "3 days replacement" },
    freeDelivery: { type: Boolean, default: true },
    technicalDetails: { type: [{ label: String, value: String }], default: [] },
    recommendation: [{ type: String }], // Keeping as String IDs for simplicity in Admin for now, or could use ObjectId if we have a robust selector
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
