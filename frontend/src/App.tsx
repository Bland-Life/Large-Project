//App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css';
import NavBar from './components/NavBar';

// Pages
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import SignupPage from './pages/SignUpPage.tsx';
import MyAccount from './pages/MyAccountPage.tsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/MyAccount" element={<MyAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
