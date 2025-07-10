import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthFetch from '../useAuthFetch';

export default function ManageProductsPage() {
  const API = process.env.REACT_APP_API_URL;
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [form, setForm] = useState({ name: '', serialNumber: '' });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts(1);
  }, []);

  // apply search + pagination
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.serialNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function loadProducts(p) {
    setError('');
    try {
      const res = await authFetch(`${API}/products?page=${p}&limit=10`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      const { products, page: cur, pages: max, total: tot } = await res.json();
      setProducts(products);
      setPage(cur);
      setPages(max);
      setTotal(tot);
      setSelected(new Set());
    } catch (err) {
      console.error('loadProducts error:', err);
      setError(err.message);
      setProducts([]);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await authFetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      await res.json();
      setForm({ name: '', serialNumber: '' });
      loadProducts(1);
    } catch (err) {
      console.error('handleAdd error:', err);
      setError(err.message);
    }
  }

  async function handleEdit(id) {
    const newName = prompt('New Name:', '');
    const newSN = prompt('New Serial Number:', '');
    if (!newName || !newSN) return;
    setError('');
    try {
      const res = await authFetch(`${API}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, serialNumber: newSN })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      await res.json();
      loadProducts(page);
    } catch (err) {
      console.error('handleEdit error:', err);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    setError('');
    try {
      const res = await authFetch(`${API}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      await res.json();
      loadProducts(page);
    } catch (err) {
      console.error('handleDelete error:', err);
      setError(err.message);
    }
  }

  function toggleSelect(id, checked) {
    const newSet = new Set(selected);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelected(newSet);
  }

  async function handleBulkDelete() {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} selected?`)) return;
    setError('');
    try {
      const res = await authFetch(`${API}/products/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [...selected] })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      await res.json();
      loadProducts(1);
    } catch (err) {
      console.error('bulkDelete error:', err);
      setError(err.message);
    }
  }

  const bulkDownloadUrl = selected.size
    ? `${API}/products/bulk-download?ids=${[...selected].join(',')}`
    : null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Products</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <input
        type="text"
        placeholder="Search by name or serial…"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: '0.5rem' }}
        />
        <input
          name="serialNumber"
          placeholder="Serial Number"
          value={form.serialNumber}
          onChange={handleChange}
          required
          style={{ marginRight: '0.5rem' }}
        />
        <button type="submit">Add</button>
      </form>
      {selected.size > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={handleBulkDelete} style={{ marginRight: '0.5rem' }}>
            Delete Selected ({selected.size})
          </button>
          {bulkDownloadUrl && (
            <a href={bulkDownloadUrl} target="_blank" rel="noopener noreferrer">
              Download ZIP
            </a>
          )}
        </div>
      )}
      {filtered.length === 0 ? (
        <p>No products match your search.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
			  <th>Code</th>
              <th>Serial</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(p._id)}
                    onChange={e => toggleSelect(p._id, e.target.checked)}
                  />
                </td>
                <td>{p.name}</td>
				<td style={{ fontFamily: 'monospace' }}>{p.productCode}</td>
                <td>{p.serialNumber}</td>
                <td>
                  <button onClick={() => handleEdit(p._id)}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ marginLeft: '0.5rem' }}>
                    Delete
                  </button>
                  <button onClick={() => navigate(`/manufacturer/product/${p._id}`)} style={{ marginLeft: '0.5rem' }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <nav style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button disabled={page <= 1} onClick={() => loadProducts(page - 1)}>
          ‹ Prev
        </button>
        <span>Page {page} of {pages}</span>
        <button disabled={page >= pages} onClick={() => loadProducts(page + 1)}>
          Next ›
        </button>
      </nav>
    </div>
  );
}
