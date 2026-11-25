import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../api.js';
import SalesTable from '../components/SalesTable.jsx';

export default function Dashboard({ notify }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.dashboard().then(setData).catch((e) => notify(e.message, true));
  }, [notify]);

  if (!data) return <p className="loading">Loading…</p>;

  return (
    <>
      <section className="cards">
        <div className="card"><p>Total Products</p><strong>{data.totalProducts}</strong><small>Products in catalogue</small></div>
        <div className="card"><p>Low Stock</p><strong>{data.lowStock}</strong><small>At or below reorder level</small></div>
        <div className="card"><p>Total Sales</p><strong>{money(data.totalSales)}</strong><small>Recorded sales amount</small></div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Recent sales</h2><p>Latest transactions recorded in the system</p></div>
          <Link className="btn secondary" to="/sales">View all</Link>
        </div>
        <SalesTable sales={data.recentSales} />
      </section>
    </>
  );
}
