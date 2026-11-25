import { useEffect, useMemo, useState } from 'react';
import { api, money } from '../api.js';

const empty = { name: '', category: '', price: '', quantity: '', reorderLevel: 5 };

export default function Products({ notify }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [term, setTerm] = useState('');

  const load = () => api.products().then(setProducts).catch((e) => notify(e.message, true));
  useEffect(() => { load(); }, []); // eslint-disable-line

  const filtered = useMemo(() => {
    const t = term.toLowerCase();
    return products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(t));
  }, [products, term]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    try {
      await api.addProduct(form);
      setForm(empty);
      notify('Product added successfully.');
      load();
    } catch (err) { notify(err.message, true); }
  }

  async function remove(id) {
    if (!confirm('Delete this product?')) return;
    try {
      const r = await api.deleteProduct(id);
      notify(r.message);
      load();
    } catch (err) { notify(err.message, true); }
  }

  return (
    <>
      <section className="panel">
        <div className="panel-head"><div><h2>Add a product</h2><p>Enter basic product and stock information</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <label>Product name<input value={form.name} onChange={set('name')} required maxLength="100" placeholder="e.g. Rice 5kg" /></label>
          <label>Category<input value={form.category} onChange={set('category')} maxLength="60" placeholder="e.g. Grocery" /></label>
          <label>Selling price (₹)<input type="number" min="0.01" step="0.01" value={form.price} onChange={set('price')} required /></label>
          <label>Quantity<input type="number" min="0" value={form.quantity} onChange={set('quantity')} required /></label>
          <label>Reorder level<input type="number" min="0" value={form.reorderLevel} onChange={set('reorderLevel')} required /></label>
          <button className="btn" type="submit">Add product</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Product inventory</h2><p>Search, review and remove products</p></div>
          <input className="search" placeholder="Search products..." value={term} onChange={(e) => setTerm(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Quantity</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((p) => {
                const low = p.quantity <= p.reorderLevel;
                return (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.category || '-'}</td>
                    <td>{money(p.price)}</td>
                    <td>{p.quantity}</td>
                    <td><span className={`pill ${low ? 'warning' : 'good'}`}>{low ? 'Low stock' : 'In stock'}</span></td>
                    <td><button className="link-danger" onClick={() => remove(p._id)}>Delete</button></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan="6" className="empty">No products found. Add your first product above.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
