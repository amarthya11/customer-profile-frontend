import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UpcomingTours from "./components/UpcomingTours";
import PastTours from "./components/PastTours";
import "./App.css";

const Navbar = ({ theme, handleThemeToggle, handleLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/upcoming-tours" className={location.pathname === "/upcoming-tours" ? "active" : ""}>
            Upcoming Tours
          </Link>
        </li>
        <li>
          <Link to="/past-tours" className={location.pathname === "/past-tours" ? "active" : ""}>
            Past Tours
          </Link>
        </li>
      </ul>
      <div className="navbar-buttons">
        <button onClick={handleThemeToggle} className="theme-toggle-btn">
          {theme === "light" ? " Dark Mode" : " Light Mode"}
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

const LoginNavbar = ({ theme, handleThemeToggle }) => {
  return (
    <nav className="navbar login-navbar">
      <div className="navbar-spacer"></div>
      <div className="navbar-buttons">
        <button onClick={handleThemeToggle} className="theme-toggle-btn">
          {theme === "light" ? " Dark Mode" : " Light Mode"}
        </button>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const [theme, setTheme] = useState(() => {
    // checking if theme is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    // saving theme preference to localStorage
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/");
  };

  const isLoginPage = location.pathname === "/";

  return (
    <div className={`app-container ${theme}`}>
      {/* Render appropriate navbar based on page */}
      {isLoginPage ? (
        <LoginNavbar theme={theme} handleThemeToggle={handleThemeToggle} />
      ) : (
        <Navbar theme={theme} handleThemeToggle={handleThemeToggle} handleLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<Dashboard theme={theme} handleThemeToggle={handleThemeToggle} />}
        />
        <Route
          path="/upcoming-tours"
          element={<UpcomingTours theme={theme} />}
        />
        <Route
          path="/past-tours"
          element={<PastTours theme={theme} />}
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;