import React from "react";
import { Link } from "react-router-dom";
import balloon from "../assets/balloon.png";
import "../css/AccountNavBar.css";


const tabs = [
  { label: "Where I've Been", to: "/WhereIveBeen" },
  { label: "Where I'm Going", to: "/WhereImGoing" },
  { label: "Join Me",         to: "/JoinMe" },
  { label: "Travel Tools",    to: "/TravelTools" }
];

export default function AccountNavBar() {
  return (
    <nav className="account-nav">
      {/*logo */}
      <img src={balloon} alt="logo" className="account-nav__logo" />

      {/*center tab */}
      <div className="account-nav__tabs">
        {tabs.map(t => (
          <Link key={t.label} to={t.to} className="account-nav__item">
            {t.label}
          </Link>
        ))}
      </div>

      {/*avatar link */}
      <Link to="/Profile">
        <div className="account-nav__avatar" />
      </Link>
    </nav>
  );
}
