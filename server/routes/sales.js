import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { getDb } from '../../db/index.ts';
import { products, sales } from '../../db/schema.ts';
import { isProductId, isStockCount, numberFromInput } from '../validation.js';

const router = Router();

function makeInvoiceNo() {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-');
  return `INV-${stamp}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function formatSale({ productId, productName, quantity, unitPrice, ...sale }) {
  return {
    ...sale,
    items: [{ product: productId, productName, quantity, unitPrice, lineTotal: sale.total }],
  };
}

router.get('/', async (req, res, next) => {
  try {
    const records = await getDb().select().from(sales).orderBy(desc(sales.createdAt));
    res.json(records.map(formatSale));
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
    const { productId } = body;
    const quantity = numberFromInput(body.quantity);
    if (!customerName || customerName.length > 100 || !isProductId(productId) || !isStockCount(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Please provide valid sale details.' });
    }

    const sale = await getDb().transaction(async (tx) => {
      const [product] = await tx.update(products)
        .set({ quantity: sql`${products.quantity} - ${quantity}` })
        .where(and(eq(products._id, productId), gte(products.quantity, quantity)))
        .returning({ name: products.name, price: products.price });
      if (!product) return null;

      const [record] = await tx.insert(sales).values({
        invoiceNo: makeInvoiceNo(),
        customerName,
        productId,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total: sql`${product.price}::numeric * ${quantity}::integer`,
      }).returning();
      return record;
    });

    if (!sale) return res.status(400).json({ message: 'Product not found or insufficient stock.' });
    res.status(201).json({ message: `Sale completed. Invoice: ${sale.invoiceNo}`, sale: formatSale(sale) });
  } catch (err) { next(err); }
});

export default router;
