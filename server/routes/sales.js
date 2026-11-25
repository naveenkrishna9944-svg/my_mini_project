import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

const router = Router();

const pad = (n) => String(n).padStart(2, '0');
function makeInvoiceNo() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `INV-${stamp}-${Math.floor(100 + Math.random() * 900)}`;
}

// GET /api/sales
router.get('/', async (req, res, next) => {
  try {
    res.json(await Sale.find().sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

// POST /api/sales  { customerName, productId, quantity }
router.post('/', async (req, res, next) => {
  try {
    const { customerName, productId } = req.body;
    const qty = Number(req.body.quantity);
    if (!customerName?.trim() || !mongoose.isValidObjectId(productId) || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: 'Please provide valid sale details.' });
    }

    // Atomic stock deduction: only succeeds if enough stock exists, so two
    // simultaneous sales can never oversell (works on a standalone MongoDB,
    // no replica set / transactions needed).
    const product = await Product.findOneAndUpdate(
      { _id: productId, quantity: { $gte: qty } },
      { $inc: { quantity: -qty } },
      { new: true }
    );
    if (!product) return res.status(400).json({ message: 'Product not found or insufficient stock.' });

    try {
      const total = Math.round(product.price * qty * 100) / 100;
      const sale = await Sale.create({
        invoiceNo: makeInvoiceNo(),
        customerName,
        items: [{ product: product._id, productName: product.name, quantity: qty, unitPrice: product.price, lineTotal: total }],
        total,
      });
      res.status(201).json({ message: `Sale completed. Invoice: ${sale.invoiceNo}`, sale });
    } catch (err) {
      // Roll back the stock if saving the sale failed
      await Product.updateOne({ _id: productId }, { $inc: { quantity: qty } });
      throw err;
    }
  } catch (e) { next(e); }
});

export default router;
