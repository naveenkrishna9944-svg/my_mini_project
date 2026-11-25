import { Router } from 'express';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const [totalProducts, lowStock, totals, recentSales] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ $expr: { $lte: ['$quantity', '$reorderLevel'] } }),
      Sale.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Sale.find().sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ totalProducts, lowStock, totalSales: totals[0]?.total ?? 0, recentSales });
  } catch (e) { next(e); }
});

export default router;
