import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import CSS file for styling
import Sidebar from './Sidebar'; // Import Sidebar component

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from session storage
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser && sessionUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(sessionUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        sessionStorage.removeItem('user'); // Clear invalid data
        navigate('/login');
      }
    } else {
      navigate('/login'); // Redirect to login if user data is not found
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <Sidebar /> {/* Add Sidebar component */}
      <div className="main-content">
        <div className="profile-header">
          <img src={user.profilePicture || 'https://via.placeholder.com/150'} alt="Profile" className="profile-picture" />
          <h1 className="profile-name">{user.name || 'Not Available'}</h1>
        </div>
        <div className="profile-details">
          <p><strong>Email:</strong> {user.email || 'Not Available'}</p>
          <p><strong>Joined:</strong> {new Date(user.joinedDate).toLocaleDateString() || 'Not Available'}</p>
          <p><strong>Bio:</strong> {user.bio || 'Not Available'}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
