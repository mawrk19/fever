import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import CSS file for styling
import Sidebar from './Sidebar'; // Import Sidebar component
import { firestore } from './firebase'; // Import Firestore database
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const navigate = useNavigate();
  const db = firestore; // Define the db variable

  useEffect(() => {
    // Retrieve user data from session storage
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser && sessionUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(sessionUser);
        console.log('Parsed user:', parsedUser); // Add logging
        if (!parsedUser.uid) {
          console.error('User UID is undefined');
          sessionStorage.removeItem('user'); // Clear invalid data
          navigate('/login');
          return;
        }
        setUser(parsedUser);
        setEditedUser(parsedUser);
        // Fetch user data from Firestore
        const fetchUserData = async () => {
          const userDoc = await getDoc(doc(db, 'users', parsedUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
            setEditedUser(userData);
          }
        };
        fetchUserData();
      } catch (error) {
        console.error('Error parsing user data:', error);
        sessionStorage.removeItem('user'); // Clear invalid data
        navigate('/login');
      }
    } else {
      navigate('/login'); // Redirect to login if user data is not found
    }
  }, [navigate, db]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!editedUser.uid) {
      console.error('User UID is undefined');
      return;
    }
    setUser(editedUser);
    sessionStorage.setItem('user', JSON.stringify(editedUser));
    setIsEditing(false);
    // Update Firestore with edited user data
    try {
      await setDoc(doc(db, 'users', editedUser.uid), editedUser);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <Sidebar /> {/* Add Sidebar component */}
      <div className="main-content">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-card">
          <img
            src={user.imageUrl || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-details">
            {isEditing ? (
              <>
                <p>
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name || ''}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </p>
                <p>
                  <strong>Email:</strong>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ''}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </p>
                <p>
                  <strong>Contact Number:</strong>
                  <input
                    type="text"
                    name="contactNumber"
                    value={editedUser.contactNumber || ''}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </p>
                <button onClick={handleSaveClick} className="profile-button save-button">Save</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name || 'Not Available'}</p>
                <p><strong>Email:</strong> {user.email || 'Not Available'}</p>
                <p><strong>Contact Number:</strong> {user.contactNumber || 'Not Available'}</p>
                <button onClick={handleEditClick} className="profile-button edit-button">Edit</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
