// frontend/src/pages/CustomerHomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerHomePage() {
  const API = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => { loadPage(1); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.serialNumber||'').toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function loadPage(p) {
    const res = await fetch(`${API}/products?page=${p}&limit=10`);
    const { products, page: cur, pages: max } = await res.json();
    setProducts(products); setPage(cur); setPages(max);
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1>Find Your Product</h1>
      <input
        type="text"
        placeholder="Search by name or serial…"
        value={searchTerm}
        onChange={e=>setSearchTerm(e.target.value)}
        style={{marginBottom:'1rem',width:'100%',padding:'0.5rem'}}
      />

      <ul>
        {filtered.map(p=>(
          <li key={p._id}>
            <Link to={`/customer/product/${p._id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>

      <nav style={{marginTop:'1rem',display:'flex',gap:'1rem'}}>
        <button disabled={page<=1} onClick={()=>loadPage(page-1)}>‹ Prev</button>
        <span>Page {page} of {pages}</span>
        <button disabled={page>=pages} onClick={()=>loadPage(page+1)}>Next ›</button>
      </nav>
    </div>
  );
}
