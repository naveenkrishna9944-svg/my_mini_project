import express from 'express';
import productRoutes from './routes/products.js';
import saleRoutes from './routes/sales.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
app.disable('x-powered-by');
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON request.' });
  }
  if (err.status === 413) {
    return res.status(413).json({ message: 'Request is too large.' });
  }
  console.error('RetailLite API request failed.');
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

export default app;
