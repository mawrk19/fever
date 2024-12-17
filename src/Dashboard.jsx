import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { firebaseConfig } from './firebaseConfig';
import './Dashboard.css';
import Sidebar from './Sidebar';
import History from './History';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function Dashboard() {
  const [temperatures, setTemperatures] = useState([]);

  // Function to retrieve temperature data
  function retrieveTemperatureData() {
    const temperaturesRef = ref(database, 'log/temperatures');
    get(temperaturesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tempArray = Object.values(data)
          .map(temp => ({
            ...temp,
            temperature: temp.temperature + 12
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
        setTemperatures(tempArray);
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error('Error retrieving data: ', error);
    });
  }

  // Fetch data when the component mounts
  useEffect(() => {
    retrieveTemperatureData();
    const interval = setInterval(retrieveTemperatureData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="title-container">
          <h1>Fever Scanner</h1>
        </div>

        <div className="centered-table-container">
          <History temperatures={temperatures} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
