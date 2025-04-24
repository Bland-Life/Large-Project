// MyAccountPage.tsx  (pages) — please keep this comment

import React from "react";
import AccountNavBar from "../components/AccountNavBar";
import "../css/AccountPage.css";
import MapExplorer from "../components/MapExplorer";

const MyAccountPage: React.FC = () => (
  <div className="account-page-root">
    <AccountNavBar />

    {/* ---- Map ---- */}
    <section className="account-map">
      <MapExplorer />
    </section>

    {/* ---- Stats ---- */}
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
);

export default MyAccountPage;
