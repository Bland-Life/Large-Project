// src/pages/MyAccountPage.tsx
import React from "react";
import AccountNavBar from "../components/AccountNavBar";
import MapExplorer from "../components/MapExplorer";
import "../css/AccountPage.css";

const MyAccountPage: React.FC = () => {
  // assume localStorage was set at login
  const userName = localStorage.getItem("username") || "guest";

  // fetch visited count
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    fetch(`https://ohtheplacesyoullgo.space/api/getcountries/${userName}`)
      .then(res => (res.ok ? res.json() : []))
      .then((arr: string[]) => setCount(arr.length))
      .catch(() => setCount(0));
  }, [userName]);

  return (
    <div className="account-page-root">
      <AccountNavBar />

      <section className="account-map">
        <MapExplorer userName={userName} />
      </section>

      <section className="travel-stats">
        <h2>Travel Stats</h2>
        <div className="stat-grid">
          <span>
            <strong>{count}</strong> / 195 countries visited
          </span>
        </div>
      </section>
    </div>
  );
};

export default MyAccountPage;
