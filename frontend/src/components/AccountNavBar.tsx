import React from "react";
import { Link } from "react-router-dom";
import balloon from "../assets/balloon.png";
import "./AccountNavBar.css";

const tabs = [
  { label: "Where I've Been", href: "#been" },
  { label: "Where I'm Going", href: "#going" },
  { label: "Join Me",         href: "#join"  },
  { label: "Travel Tools",    href: "#tools" }
];

export default function AccountNavBar() {
  return (
    <nav className="account-nav">
      <img src={balloon} alt="logo" className="account-nav__logo" />

      <div className="account-nav__tabs">
        {tabs.map(t => (
          <Link key={t.label} to={t.href} className="account-nav__item">
            {t.label}
          </Link>
        ))}
      </div>

      <div className="account-nav__avatar" />
    </nav>
  );
}
