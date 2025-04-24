import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './AccountNavBar';  // Assuming NavBar is in the same directory

const Layout = () => {
  return (
    <div>

      
      {/* Outlet renders the current page component */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
