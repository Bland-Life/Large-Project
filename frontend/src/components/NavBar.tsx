//NavBar.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={{
      background: '#f5f5f5',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ccc'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        🌍 Oh The Places You'll Go!
      </div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/">Map</Link>
        <Link to="/Login">Login</Link>
        <Link to="/Dashboard">Dashboard</Link>
      </div>
    </nav>
  );
};

export default NavBar;
