import React from "react";
import MapExplorer from "../components/MapExplorer";
import "../css/AccountPage.css";

const MyAccountPage: React.FC = () => {
  const userName = localStorage.getItem("username") || "guest";
  const [count, setCount] = React.useState(0);

  // load initial count from localStorage
  React.useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem("demoVisited") || "[]");
    setCount(saved.length);
  }, []);

  return (
    <div className="account-page-root">
      
      <section className="travel-stats">
        <h2>Travel Stats</h2>
        <div className="stat-grid">
          <span>
            <strong>{count}</strong> / 195 countries visited
          </span>
        </div>
      </section>
      
      <section className="account-map">
        <MapExplorer
          userName={userName}
          onVisitedChange={(newCount: number) => setCount(newCount)}
        />
      </section>

      
    </div>
  );
};

export default MyAccountPage;
