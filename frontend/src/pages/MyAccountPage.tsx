import React from "react";
import videoBack from "../assets/clouds.mp4";
import "../css/App.css";

const MyAccount = () => {
  return (
    <div className="page-content">
      <video src={videoBack} autoPlay loop muted />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
          padding: "2rem",
          zIndex: 1,
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#1c1c1c" }}>
          Welcome back, (Name of Account holder)
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <button className="account-button" style={{ background: "#d4145a" }}>My Map</button>
          <button className="account-button" style={{ background: "#f75d1a" }}>Planned Trips</button>
          <button className="account-button" style={{ background: "#fbb03b" }}>Past Trips</button>
          <button className="account-button" style={{ background: "#7ac943" }}>Saved Destinations</button>
          <button className="account-button" style={{ background: "#00c0ef" }}>Preferences</button>
          <button className="account-button" style={{ background: "#8e44ad" }}>Account Settings</button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
