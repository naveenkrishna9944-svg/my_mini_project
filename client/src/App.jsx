import { useState, useCallback } from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Sales from './pages/Sales.jsx';

const titles = { '/': 'Dashboard', '/products': 'Products', '/sales': 'Sales' };

export default function App() {
  const { pathname } = useLocation();
  const [notice, setNotice] = useState(null);

  const notify = useCallback((text, error = false) => {
    setNotice({ text, error });
    setTimeout(() => setNotice(null), 4000);
  }, []);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Retail<span>Lite</span></div>
        <p className="muted">SHOP MANAGEMENT</p>
        <NavLink to="/" end>▦ Dashboard</NavLink>
        <NavLink to="/products">▣ Products</NavLink>
        <NavLink to="/sales">▤ Sales</NavLink>
        <div className="side-note">mini project</div>
      </aside>

      <main className="main">
        <header>
          <div>
            <p className="eyebrow">RETAIL STORE / OVERVIEW</p>
            <h1>{titles[pathname] ?? 'Dashboard'}</h1>
          </div>
          <div className="avatar">A</div>
        </header>

        {notice && <div className={`notice ${notice.error ? 'error' : ''}`}>{notice.text}</div>}

        <Routes>
          <Route path="/" element={<Dashboard notify={notify} />} />
          <Route path="/products" element={<Products notify={notify} />} />
          <Route path="/sales" element={<Sales notify={notify} />} />
        </Routes>

        <footer>RetailLite · Built with MongoDB, Express, React and Node.js</footer>
      </main>
    </div>
  );
}
