import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'transparent'
    }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      {user?.role === 'manufacturer' && (
        <Link to="/manufacturer" style={{ marginRight: '1rem' }}>
          Dashboard
        </Link>
      )}
      {user ? (
        <button onClick={logout} style={{ marginLeft: 'auto' }}>
          Log Out
        </button>
      ) : (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <Link to="/login">Log In</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      )}
    </nav>
);
}
