import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, trim: true, maxlength: 60, default: '' },
    price: { type: Number, required: true, min: 0.01 },
    quantity: { type: Number, required: true, min: 0, default: 0, validate: Number.isInteger },
    reorderLevel: { type: Number, required: true, min: 0, default: 5, validate: Number.isInteger },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
