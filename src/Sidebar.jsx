import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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
          <li><a href="/profile">Profile</a></li>
          <li><a href="/history">History</a></li>
          <li><button className="logout-button">Logout</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
