import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage';
import ManageProductsPage from './pages/ManageProductsPage.jsx';

export default function App() {
  return (
    <Router>
      <nav style={{
        padding: '1rem',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '1rem'
      }}>
        <Link to="/">Home</Link>
        <Link to="/manage">Manage Products</Link>
      </nav>

      <main style={{ padding: '2rem' }}>
        <Routes>
          {/* List all products */}
          <Route path="/" element={<HomePage />} />

          {/* CRUD UI for products */}
          <Route path="/manage" element={<ManageProductsPage />} />

          {/* View a single product + manuals */}
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </Router>
  );
}
