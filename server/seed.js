import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const sample = [
  { name: 'Rice 5kg', category: 'Grocery', price: 320, quantity: 25, reorderLevel: 5 },
  { name: 'Sunflower Oil 1L', category: 'Grocery', price: 145, quantity: 18, reorderLevel: 5 },
  { name: 'Bath Soap', category: 'Personal Care', price: 38, quantity: 4, reorderLevel: 5 },
  { name: 'Notebook', category: 'Stationery', price: 55, quantity: 40, reorderLevel: 8 },
  { name: 'Toothpaste', category: 'Personal Care', price: 92, quantity: 12, reorderLevel: 5 },
];

await mongoose.connect(process.env.MONGO_URI);
await Product.deleteMany({});
await Product.insertMany(sample);
console.log(`Seeded ${sample.length} products.`);
await mongoose.disconnect();
