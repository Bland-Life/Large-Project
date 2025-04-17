import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <nav
      style={{
        background: 'linear-gradient(to right, #D726D3, #F1392F, #FFA500)',
        padding: '1rem 2rem',
        borderRadius: '20px',
        margin: '1rem 2rem 0',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'white', whiteSpace: 'nowrap' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          🌍 Oh The Places You'll Go!
        </Link>
      </div>

      {/* Spacer between logo and nav buttons */}
      <div style={{ width: '3rem' }}></div>

      {/* Nav Buttons */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {/* <NavButton to="/MyAccount">Home</NavButton> */}
        <NavButton to="/Map">Map</NavButton>
        <NavButton to="/Explore">Explore</NavButton>
        <NavButton to="/Contact">Contact Us</NavButton>
      </div>

      <div style={{ marginLeft: '4rem' }}>
        {user ? (
            <Link
            to="/MyAccount"
            style={{
                color: 'white',
                fontWeight: 500,
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '12px',
                textDecoration: 'none',
            }}
            >
            My Account
            </Link>
        ) : (
            <Link
            to="/Login"
            style={{
                color: 'white',
                fontWeight: 500,
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '12px',
                textDecoration: 'none',
            }}
            >
            Login
            </Link>
        )}
        </div>

    </nav>
  );
};

const NavButton = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link
    to={to}
    style={{
      color: 'white',
      fontWeight: 500,
      textDecoration: 'none',
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: '12px',
      transition: 'background 0.2s ease',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
  >
    {children}
  </Link>
);

const dropdownStyle = {
  display: 'block',
  padding: '0.4rem 1rem',
  textDecoration: 'none',
  color: '#333',
  borderRadius: '6px',
  marginBottom: '0.3rem',
};

export default NavBar;
