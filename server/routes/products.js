import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products?q=rice
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.q) {
      const safe = String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ name: new RegExp(safe, 'i') }, { category: new RegExp(safe, 'i') }];
    }
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const { name, category, price, quantity, reorderLevel } = req.body;
    const p = Number(price), q = Number(quantity), r = Number(reorderLevel ?? 5);
    if (!name?.trim() || !(p > 0) || !Number.isInteger(q) || q < 0 || !Number.isInteger(r) || r < 0) {
      return res.status(400).json({ message: 'Please enter valid product details.' });
    }
    const product = await Product.create({ name, category, price: p, quantity: q, reorderLevel: r });
    res.status(201).json(product);
  } catch (e) { next(e); }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product id.' });
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted if it existed.' });
  } catch (e) { next(e); }
});

export default router;
