// MyAccountPage.tsx  — now passes userName to MapExplorer

import React from "react";
import AccountNavBar from "../components/AccountNavBar";
import "../css/AccountPage.css";
import MapExplorer from "../components/MapExplorer";

const MyAccountPage: React.FC = () => {
  /*  🟣 1.  Get the username from localStorage.
         - If nothing’s saved yet, default to "guest" so the map still loads. */
  const userName = localStorage.getItem("username") || "guest";

  return (
    <div className="account-page-root">
      <AccountNavBar />

      {/* ---- Map ---- */}
      <section className="account-map">
        {/* 🟣 2.  Pass it here  */}
        <MapExplorer userName={userName} />
      </section>

      {/* ---- Stats ---- */}
      <section className="travel-stats">
        <h2>Travel Stats</h2>
        <div className="stat-grid">
          <span><strong>•</strong> Click countries to mark them!</span>
          {/* any additional stats you want */}
        </div>
      </section>
    </div>
  );
};

export default MyAccountPage;
