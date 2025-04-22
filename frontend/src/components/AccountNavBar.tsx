/* AccountNavBar.tsx (components) */

import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import balloon from "../assets/balloon.png";
import "../css/AccountNavBar.css";


const tabs = [
  { label: "Where I've Been", to: "/WhereIveBeen" },
  { label: "Where I'm Going", to: "/WhereImGoing" },
  { label: "Join Me",         to: "/JoinMe" },
  { label: "Travel Tools",    to: "/TravelTools" }
];

export default function AccountNavBar() {
  let _ud: any = localStorage.getItem('user_data');
  let ud = JSON.parse(_ud);

  const [userData, setUserData] = useState({
      name: ud.firstName,
      username: ud.username,
      email: ud.email,
      profileimage: ud.profileimage,
  });
  
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="account-nav">
      {/*logo */}
      <img src={balloon} alt="logo" className="account-nav__logo" />

      {/*center tab */}
      <div className="account-nav__tabs">
        {tabs.map(t => (
          <Link 
            key={t.label} 
            to={t.to} 
            className={`account-nav__item ${currentPath === t.to ? "account-nav__item--active" : ""}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/*avatar link */}
      <Link to="/Profile">
        <div 
          className="account-nav__avatar" 
          style={{
              background: userData.profileimage
                  ? `#ccc url(${userData.profileimage}) center/160% no-repeat`
                  : `#ccc`,
          }}/>
      </Link>
    </nav>
  );
}
