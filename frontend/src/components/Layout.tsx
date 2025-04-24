import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './AccountNavBar';  // Assuming NavBar is in the same directory

const Layout = () => {
  return (
    <div>
      {/* NavBar is shared across all pages */}
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Layout;
