// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/App.css";

/* existing pages */
import HomePage          from "./pages/HomePage";
import LoginPage         from "./pages/LoginPage";
import SignupPage        from "./pages/SignUpPage";
import MyAccount         from "./pages/MyAccountPage";
import WhereIveBeenPage  from "./pages/WhereIveBeenPage";
import WhereImGoingPage  from "./pages/WhereImGoingPage";
import JoinMePage        from "./pages/JoinMePage";
import TravelToolsPage   from "./pages/TravelToolsPage";
import UserProfilePage   from "./pages/UserProfilePage";

/* your new map component */
import MapExplorer       from "./components/MapExplorer";

function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/"            element={<HomePage />} />
        <Route path="/Login"       element={<LoginPage />} />
        <Route path="/Signup"      element={<SignupPage />} />

        {/* account dashboard */}
        <Route path="/MyAccount"   element={<MyAccount />} />

        {/* sub‑sections */}
        <Route path="/WhereIveBeen" element={<MyAccount />} />
        <Route path="/WhereImGoing" element={<WhereImGoingPage />} />
        <Route path="/JoinMe"       element={<JoinMePage />} />
        <Route path="/TravelTools"  element={<TravelToolsPage />} />
        <Route path="/Profile"      element={<UserProfilePage />} />

        {/* drill‑down map routes (optional direct access) */}
        <Route path="/map"                          element={<MapExplorer />} />
        <Route path="/map/:countryCode"             element={<MapExplorer />} />
        <Route path="/map/:countryCode/:cityId"     element={<MapExplorer />} />
      </Routes>
    </Router>
  );
}

export default App;
