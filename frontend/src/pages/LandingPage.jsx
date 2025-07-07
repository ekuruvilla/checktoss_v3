// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{
      padding: '4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <h1>Welcome to Checktoss</h1>
      {/* Manufacturer options */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/login">
          <button style={{ padding: '1rem 2rem' }}>
            Manufacturer Log In
          </button>
        </Link>
        <Link to="/register">
          <button style={{ padding: '1rem 2rem' }}>
            Manufacturer Sign Up
          </button>
        </Link>
      </div>

      {/* Customer */}
      <Link to="/customer">
        <button style={{ padding: '1rem 2rem' }}>
          Continue as Customer
        </button>
      </Link>
    </div>
  );
}
