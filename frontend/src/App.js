import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './PrivateRoute';
import LandingPage from './pages/LandingPage';
import ManufacturerHomePage from './pages/ManufacturerHomePage';
import ManageProductsPage from './pages/ManageProductsPage';
import ProductPage from './pages/ProductPage';             // with uploads
import CustomerHomePage from './pages/CustomerHomePage';
import ProductPageReadOnly from './pages/ProductPageReadOnly';

export default function App() {
  return (
    <Router>
      <NavBar />

      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/manufacturer"
            element={
              <PrivateRoute role="manufacturer">
                <ManufacturerHomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/manufacturer/manage"
            element={
              <PrivateRoute role="manufacturer">
                <ManageProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/manufacturer/product/:id"
            element={
              <PrivateRoute role="manufacturer">
                <ProductPage />
              </PrivateRoute>
            }
          />

          <Route path="/customer" element={<CustomerHomePage />} />
          <Route
            path="/customer/product/:id"
            element={<ProductPageReadOnly />}
          />
        </Routes>
      </main>
    </Router>
  );
}
