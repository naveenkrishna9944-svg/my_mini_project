import { Router } from 'express';
import { desc, lte, sql } from 'drizzle-orm';
import { getDb } from '../../db/index.ts';
import { products, sales } from '../../db/schema.ts';
import { formatSale } from './sales.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const [[totals], [revenue], recentSales] = await Promise.all([
      db.select({
        totalProducts: sql`count(*)`.mapWith(Number),
        lowStock: sql`count(*) filter (where ${lte(products.quantity, products.reorderLevel)})`.mapWith(Number),
      }).from(products),
      db.select({ totalSales: sql`coalesce(sum(${sales.total}), 0)`.mapWith(Number) }).from(sales),
      db.select().from(sales).orderBy(desc(sales.createdAt)).limit(5),
    ]);
    res.json({ ...totals, ...revenue, recentSales: recentSales.map(formatSale) });
  } catch (err) { next(err); }
});

export default router;
