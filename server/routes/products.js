import { Router } from 'express';
import { desc, eq, ilike, or } from 'drizzle-orm';
import { getDb } from '../../db/index.ts';
import { products } from '../../db/schema.ts';
import { isProductId, isStockCount, numberFromInput } from '../validation.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`;
    const filter = search ? or(ilike(products.name, pattern), ilike(products.category, pattern)) : undefined;
    res.json(await getDb().select().from(products).where(filter).orderBy(desc(products.createdAt)));
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const price = numberFromInput(body.price);
    const quantity = numberFromInput(body.quantity);
    const reorderLevel = numberFromInput(body.reorderLevel ?? 5);
    if (!name || name.length > 100 || category.length > 60 || !Number.isFinite(price) ||
        price < 0.01 || price > 9_999_999_999.99 || !isStockCount(quantity) || !isStockCount(reorderLevel)) {
      return res.status(400).json({ message: 'Please enter valid product details.' });
    }
    const [product] = await getDb().insert(products).values({ name, category, price, quantity, reorderLevel }).returning();
    res.status(201).json(product);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!isProductId(req.params.id)) return res.status(400).json({ message: 'Invalid product id.' });
    await getDb().delete(products).where(eq(products._id, req.params.id));
    res.json({ message: 'Product deleted if it existed.' });
  } catch (err) { next(err); }
});

export default router;
