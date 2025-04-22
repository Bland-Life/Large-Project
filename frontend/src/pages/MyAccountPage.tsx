//MyAccountPage.tsx (pages)

import React from "react";
import AccountNavBar from "../components/AccountNavBar";
import "../css/AccountPage.css";

const MyAccountPage = () => (
  <div className="account-page-root">
    <div className="account-page-content">
      <AccountNavBar />

      {/* --- Map section (placeholder) --- */}
      <section id="been" className="account-map">
        <div className="map-placeholder">Map will render here</div>
      </section>

      {/* --- Travel‑stats strip --- */}
      <section className="travel-stats">
        <h2>Travel Stats</h2>
        <div className="stat-grid">
          <span><strong>7</strong> / 7 continents</span>
          <span><strong>8</strong> / 195 countries</span>
          <span><strong>30</strong> / 50 states</span>
          <span><strong>22</strong> / 87 megacities</span>
        </div>
      </section>
    </div>
  </div>
);

export default MyAccountPage;
