import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard'; // Import the Dashboard component
import Register from './Register'; // Import the Register component
import Home from './Home'; // Import the Home component
import Profile from './Profile'; // Import the Profile component
import History from './History'; // Import the History component
import Sidebar from './Sidebar'; // Import the Sidebar component
import VerifyEmail from './VerifyEmail'; // Import the VerifyEmail component

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar /> {/* Add Sidebar component */}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} /> {/* Register route */}
            <Route path="/home" element={<Home />} /> {/* Add Home route */}
            <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
            <Route path="/history" element={<History />} /> {/* Add History route */}
            <Route path="/verify-email" element={<VerifyEmail />} /> {/* Add VerifyEmail route */}
            {/* Remove redirection to login for email verification */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
