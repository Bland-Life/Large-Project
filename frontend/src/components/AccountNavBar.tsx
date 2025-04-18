//AccountNavBar.tsx

import React from "react";
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
      {tabs.map(t => (
        <a key={t.label} href={t.href} className="account-nav__item">
          {t.label}
        </a>
      ))}
    </nav>
  );
}
