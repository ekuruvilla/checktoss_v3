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
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/manufacturer">
          <button style={{ padding: '1rem 2rem' }}>Manufacturer</button>
        </Link>
        <Link to="/customer">
          <button style={{ padding: '1rem 2rem' }}>Customer</button>
        </Link>
      </div>
    </div>
  );
}
