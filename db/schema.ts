import { sql } from 'drizzle-orm';
import { check, index, integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  _id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  category: varchar({ length: 60 }).notNull().default(''),
  price: numeric({ precision: 12, scale: 2, mode: 'number' }).notNull(),
  quantity: integer().notNull().default(0),
  reorderLevel: integer('reorder_level').notNull().default(5),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('products_positive_price', sql`${table.price} >= 0.01`),
  check('products_nonnegative_stock', sql`${table.quantity} >= 0 and ${table.reorderLevel} >= 0`),
]);

export const sales = pgTable('sales', {
  _id: uuid('id').defaultRandom().primaryKey(),
  invoiceNo: varchar('invoice_no', { length: 40 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  productId: uuid('product_id').notNull(),
  productName: varchar('product_name', { length: 100 }).notNull(),
  quantity: integer().notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2, mode: 'number' }).notNull(),
  total: numeric({ precision: 22, scale: 2, mode: 'number' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('sales_created_at_idx').on(table.createdAt),
  check('sales_positive_quantity', sql`${table.quantity} > 0`),
]);
