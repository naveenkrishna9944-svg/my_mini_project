import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../api.js';
import SalesTable from '../components/SalesTable.jsx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    api.dashboard().then((result) => {
      if (active) setData(result);
    }).catch(() => {
      if (active) setError('Could not load the dashboard. Please try again.');
    });
    return () => { active = false; };
  }, [attempt]);

  if (error) return (
    <section className="panel">
      <p role="alert">{error}</p>
      <button className="btn" type="button" onClick={() => { setError(''); setAttempt((previous) => previous + 1); }}>Try again</button>
    </section>
  );
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
