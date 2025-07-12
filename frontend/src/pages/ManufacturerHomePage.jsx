import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const API = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => { loadPage(1);  }, []);

  // derive filtered list
  const filtered = products.filter(p =>{
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.serialNumber||'').toLowerCase().includes(term) ||
      (p.productCode||'').toLowerCase().includes(term)
    );
  });

  async function loadPage(p) {
    try {
      const res = await fetch(`${API}/products?page=${p}&limit=10`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      const { products, page: cur, pages: max } = await res.json();
      setProducts(products);
      setPage(cur);
      setPages(max);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <Link to="/manufacturer/manage">
        <button style={{marginBottom:'1rem'}}>Manage Products</button>
      </Link>
      <input
        type="text"
        placeholder="Search by product code, name or serial…"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

      <ul>
        {filtered.map(p => (
          <li key={p._id}>
            <Link to={`/manufacturer/product/${p._id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>

      <nav style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button disabled={page <= 1} onClick={() => loadPage(page - 1)}>
          ‹ Prev
        </button>
        <span>Page {page} of {pages}</span>
        <button disabled={page >= pages} onClick={() => loadPage(page + 1)}>
          Next ›
        </button>
      </nav>
    </div>
  );
}
