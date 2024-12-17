import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { firebaseConfig } from './firebaseConfig';  // Importing Firebase configuration
import './Dashboard.css'; // Add this import

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function Dashboard() {
  const [temperatures, setTemperatures] = useState([]);

  // Generate random number between 0.3 and 0.8
  const generateRandomOffset = () => {
    return Math.random() * (0.8 - 0.3) + 0.3;
  };

  // Function to store temperature data in Firebase
  function storeTemperature() {
    const baseTemperature = 25.0; // Base temperature value
    const randomOffset = generateRandomOffset();
    const currentTemperature = Number((baseTemperature + randomOffset).toFixed(2)); // Round to 2 decimal places
    
    const temperatureRef = ref(database, 'temperatures/' + Date.now()); // Unique key based on timestamp
    set(temperatureRef, {
      temperature: currentTemperature,
      timestamp: Date.now()
    }).then(() => {
      retrieveTemperatureData(); // Fetch updated data after storing
    }).catch((error) => {
      console.error('Error storing temperature data: ', error);
    });
  }

  // Function to retrieve temperature data
  function retrieveTemperatureData() {
    const temperaturesRef = ref(database, 'temperatures');
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
      <div className="title-container">
        <h1>Fever Scanner</h1>
      </div>
      
      <button className="store-button" onClick={storeTemperature}>
        Store Current Temperature
      </button>

      <div className="centered-table-container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Temperature (°C)</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {temperatures.map((temp, index) => (
                <tr key={index}>
                  <td>{temp.temperature.toFixed(1)} °C</td>
                  <td className={temp.temperature >= 37.6 ? 'fever-status' : 'normal-status'}>
                    {temp.temperature >= 37.6 ? 'Fever' : 'Normal'}
                  </td>
                  <td>{new Date(temp.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
