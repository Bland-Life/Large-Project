import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/App.css";

/* existing pages */
import HomePage        from "./pages/HomePage";
import LoginPage       from "./pages/LoginPage";
import SignupPage      from "./pages/SignUpPage";
import MyAccount       from "./pages/MyAccountPage";

/* pages already in your tree */
import JoinMePage          from "./pages/JoinMePage";
import TravelToolsPage     from "./pages/TravelToolsPage";
import WhereImGoingPage    from "./pages/WhereImGoingPage";

/* page you still need to create — stub shown below */
import WhereIveBeenPage    from "./pages/WhereIveBeenPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/Login"         element={<LoginPage />} />
        <Route path="/Signup"        element={<SignupPage />} />
        <Route path="/MyAccount"     element={<MyAccount />} />

        {/* account‑sub routes */}
        <Route path="/WhereIveBeenPage"  element={<WhereIveBeenPage />} />
        <Route path="/WhereImGoingPage"  element={<WhereImGoingPage />} />
        <Route path="/JoinMePage"        element={<JoinMePage />} />
        <Route path="/TravelToolsPage"   element={<TravelToolsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
