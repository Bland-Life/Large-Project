import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

// Pages
import LoginPage from './pages/LoginPage.tsx';


function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App
