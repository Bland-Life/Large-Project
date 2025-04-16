import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={{
      background: 'linear-gradient(to right, #D726D3, #F1392F, #FFA500)', // Dusk to Dawn → Rail Rider → Orange
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          🌍 Oh The Places You'll Go!
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/Map" style={linkStyle}>Map</Link>
        <Link to="/Login" style={linkStyle}>Login</Link>
        <Link to="/Dashboard" style={linkStyle}>Dashboard</Link>
      </div>
    </nav>
  );
};

const linkStyle = {
  color: 'white',
  fontWeight: 500,
  textDecoration: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  transition: 'background 0.2s ease',
  backgroundColor: 'rgba(255,255,255,0.1)',
};

export default NavBar;
