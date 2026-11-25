import mongoose from 'mongoose';

// Line items are embedded in the sale (replaces the old sale_items table).
const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    items: { type: [itemSchema], required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Sale', saleSchema);
