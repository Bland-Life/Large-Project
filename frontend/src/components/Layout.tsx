import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';  // Assuming NavBar is in the same directory

const Layout = () => {
  return (
    <div>
      {/* NavBar is shared across all pages */}
      <NavBar />
      
      {/* Outlet renders the current page component */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
