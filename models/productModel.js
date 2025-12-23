const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  moq: { type: String, default: "" },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean, default: false },
  fabric: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  date: { type: Number, required: true },
});

// 🔥 INDEXES (VERY IMPORTANT)
productSchema.index({ date: -1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ bestseller: 1 });
