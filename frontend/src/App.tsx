import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css'

// Pages
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import MapPage from './pages/MapPage.tsx';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App
