import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  const isManufacturer = user?.role === 'manufacturer';

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
		{/* Manufacturer*/}
        {isManufacturer ? (
          <Link to="/manufacturer">
            <button style={{ padding: '1rem 2rem' }}>
              Continue as Manufacturer
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button style={{ padding: '1rem 2rem' }}>
              Continue as Manufacturer
            </button>
          </Link>
        )}
        {/* Customer */}
        <Link to="/customer">
          <button style={{ padding: '1rem 2rem' }}>
            Continue as Customer
          </button>
        </Link>
      </div>     
    </div>
  );
}
