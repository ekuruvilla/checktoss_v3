import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage           from './pages/LandingPage';
import ManufacturerHomePage  from './pages/ManufacturerHomePage';
import ManageProductsPage    from './pages/ManageProductsPage';
import ProductPage           from './pages/ProductPage';             // with uploads
import CustomerHomePage      from './pages/CustomerHomePage';
import ProductPageReadOnly   from './pages/ProductPageReadOnly'; 

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
        <Link to="/manufacturer/manage">Manage Products</Link>
      </nav>

      <main style={{ padding: '2rem' }}>
        <Routes>
			<Route path="/"                          element={<LandingPage />} />
			<Route path="/manufacturer"              element={<ManufacturerHomePage />} />
			<Route path="/manufacturer/manage"       element={<ManageProductsPage />} />
			<Route path="/manufacturer/product/:id"  element={<ProductPage />} />

			<Route path="/customer"                  element={<CustomerHomePage />} />
			<Route path="/customer/product/:id"      element={<ProductPageReadOnly />} />
      </Routes>
      </main>
    </Router>
  );
}
