import { useEffect, useMemo, useState } from 'react';
import { api, money } from '../api.js';
import SalesTable from '../components/SalesTable.jsx';

export default function Sales({ notify }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ customerName: '', productId: '', quantity: '' });
  const [term, setTerm] = useState('');

  const load = () =>
    Promise.all([api.products(), api.sales()])
      .then(([p, s]) => { setProducts(p); setSales(s); })
      .catch((e) => notify(e.message, true));
  useEffect(() => { load(); }, []); // eslint-disable-line

  const filtered = useMemo(() => {
    const t = term.toLowerCase();
    return sales.filter((s) => `${s.invoiceNo} ${s.customerName}`.toLowerCase().includes(t));
  }, [sales, term]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    try {
      const r = await api.addSale(form);
      notify(r.message);
      setForm({ customerName: '', productId: '', quantity: '' });
      load();
    } catch (err) { notify(err.message, true); }
  }

  return (
    <>
      <section className="panel">
        <div className="panel-head"><div><h2>Record a sale</h2><p>Choose an available product and quantity</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <label>Customer name<input value={form.customerName} onChange={set('customerName')} required maxLength="100" placeholder="Walk-in customer" /></label>
          <label>Product
            <select value={form.productId} onChange={set('productId')} required>
              <option value="">Select product</option>
              {products.filter((p) => p.quantity > 0).map((p) => (
                <option key={p._id} value={p._id}>{p.name} — {money(p.price)} ({p.quantity} available)</option>
              ))}
            </select>
          </label>
          <label>Quantity<input type="number" min="1" value={form.quantity} onChange={set('quantity')} required /></label>
          <button className="btn" type="submit">Complete sale</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Sales history</h2><p>Previously recorded transactions</p></div>
          <input className="search" placeholder="Search sales..." value={term} onChange={(e) => setTerm(e.target.value)} />
        </div>
        <SalesTable sales={filtered} />
      </section>
    </>
  );
}
