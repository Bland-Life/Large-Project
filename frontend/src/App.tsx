//App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css';
import NavBar from './components/NavBar';

// Pages
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
