import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Sidebar.css'; // Import Sidebar CSS

function Sidebar() {
  let user = { 
    name: 'John Doe', 
    imageUrl: 'https://via.placeholder.com/150', 
    contactNumber: 'N/A' // Default contact number
  }; 

  const sessionUser = sessionStorage.getItem('user');
  
  if (sessionUser && sessionUser !== 'undefined') {
    try {
      console.log('Session user data:', sessionUser); // Log session data
      user = JSON.parse(sessionUser);
    } catch (error) {
      console.error('Error parsing user data from session:', error);
    }
  }

  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    sessionStorage.removeItem('user'); // Remove user data from session storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <img src={user.imageUrl} alt="User" className="user-image" />
        <h2>{user.name}</h2>
        <p>Contact: {user.contactNumber}</p> {/* Display the contact number */}
      </div>
      <nav className="nav-links">
        <ul>
          <li><Link to="/home">Home</Link></li> {/* Update Home button */}
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><button className="logout-button" onClick={handleLogout}>Logout</button></li> {/* Add onClick event to logout button */}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
