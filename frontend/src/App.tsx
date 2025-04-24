//App.tsx (pages) please dont delete this comment

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/App.css";

// Pages
import HomePage           from "./pages/HomePage";
import LoginPage          from "./pages/LoginPage";
import SignupPage         from "./pages/SignUpPage";
import MyAccount          from "./pages/MyAccountPage";
import WhereIveBeenPage   from "./pages/WhereIveBeenPage";
import WhereImGoingPage   from "./pages/WhereImGoingPage";
import JoinMePage         from "./pages/JoinMePage";
import TravelToolsPage    from "./pages/TravelToolsPage";
import UserProfilePage    from "./pages/UserProfilePage";
import TestMapPage        from "./pages/TestMapPage";

// Components
import MapExplorer        from "./components/MapExplorer";
import Layout             from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignupPage />} />
        {/* Wrap all routes with Layout so nav/sidebar shows */}
        <Route element={<Layout />}>
          <Route path="/test-map" element={<TestMapPage />} />
          <Route path="/MyAccount" element={<MyAccount />} />

          {/* Sub-sections */}
          <Route path="/WhereIveBeen" element={<WhereIveBeenPage />} />
          <Route path="/WhereImGoing" element={<WhereImGoingPage />} />
          <Route path="/JoinMe" element={<JoinMePage />} />
          <Route path="/TravelTools" element={<TravelToolsPage />} />
          <Route path="/Profile" element={<UserProfilePage />} />

          {/* Map Explorer with drill-down */}
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/map/:countryCode" element={<MapExplorer />} />
          <Route path="/map/:countryCode/:cityId" element={<MapExplorer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
