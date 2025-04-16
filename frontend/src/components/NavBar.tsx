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
        <NavButton to="/">Home</NavButton>
        <NavButton to="/Map">Map</NavButton>
        <NavButton to="/Explore">Explore</NavButton>
        <NavButton to="/Contact">Contact Us</NavButton>
      </div>

      {/* Push account section to far right */}
      <div style={{ marginLeft: '4rem', marginRight: '0.5rem', position: 'relative' }}>
        <div
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
          style={{
            color: 'white',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '8px 16px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          {user ? 'My Account' : 'You are not logged in!'}
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                padding: '0.5rem',
                zIndex: 10,
                minWidth: '140px',
              }}
            >
              {!user ? (
                <>
                  <Link to="/Login" style={dropdownStyle}>Login</Link>
                  <Link to="/Signup" style={dropdownStyle}>Sign Up</Link>
                </>
              ) : (
                <Link to="/Account" style={dropdownStyle}>Go to Account</Link>
              )}
            </div>
          )}
        </div>
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
