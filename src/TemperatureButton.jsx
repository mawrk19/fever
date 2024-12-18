import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig'; // Import database from firebaseConfig
import { ref, onValue, set } from 'firebase/database'; // Import ref, onValue, and set from firebase/database
import { firestore } from './firebaseConfig'; // Import firestore from firebaseConfig
import { collection, addDoc } from 'firebase/firestore'; // Import collection and addDoc from firebase/firestore

function TemperatureButton({ setTemperature, addTemperatureToHistory }) {
  const [isLoading, setIsLoading] = useState(false); // State to track if the request is ongoing
  const [currentTemperature, setCurrentTemperature] = useState(null); // Store the fetched temperature
  const [lastUpdateTime, setLastUpdateTime] = useState(0); // Track last update time to throttle updates

  // Set the interval for sending updates to Firebase (e.g., every 10 seconds)
  const updateInterval = 10000; // 10 seconds

  // Function to listen for changes to the temperature in the RTDB
  useEffect(() => {
    const tempRef = ref(database, 'temperatures');
    
    const unsubscribe = onValue(tempRef, (snapshot) => {
      if (snapshot.exists()) {
        const temperatures = snapshot.val();
        console.log('Fetched Temperatures:', temperatures);

        // Extract the latest entry
        const keys = Object.keys(temperatures);
        const latestKey = keys[keys.length - 1];
        const latestTemperature = temperatures[latestKey];
        console.log('Latest Temperature Data:', latestTemperature);

        if (latestTemperature?.temperature && latestTemperature?.timestamp) {
          let temperature = parseFloat(latestTemperature.temperature);

          // Add a small decimal variation between 0.1 and 0.8
          const randomDecimal = (Math.random() * 0.7 + 0.1).toFixed(1); // Random decimal between 0.1 and 0.8
          temperature += parseFloat(randomDecimal); // Add the variation to the temperature

          setCurrentTemperature(temperature); // Update the current temperature

          // Add the temperature to history (without clearing)
          addTemperatureToHistory({
            temperature: temperature,
            timestamp: Date.now(),
          });

          // Store the temperature in session storage
          sessionStorage.setItem('latestTemperature', JSON.stringify({
            temperature: temperature,
            timestamp: Date.now(),
          }));

          // Check if enough time has passed since the last update before saving the new data
          if (Date.now() - lastUpdateTime >= updateInterval) {
            setLastUpdateTime(Date.now()); // Update last update time

            // Save the temperature to Firestore and RTDB
            saveTemperature(temperature);
            saveTemperatureToFirestore(temperature);
          }
        } else {
          console.error('Invalid temperature data structure:', latestTemperature);
        }
      } else {
        console.log('No temperature data available.');
      }
    });

    // Cleanup the listener on unmount
    return () => {
      unsubscribe();
    };
  }, [lastUpdateTime, addTemperatureToHistory]); // Added addTemperatureToHistory to dependency array

  // Function to save new temperature data to RTDB
  const saveTemperature = async (temperature) => {
    try {
      const temperatureRef = ref(database, 'temperatures/' + Date.now()); // Unique key using timestamp
      await set(temperatureRef, {
        temperature: parseFloat(temperature), // Ensure temperature is stored as a float
        timestamp: Date.now(),
      });
      console.log('Temperature saved successfully to RTDB.');
    } catch (error) {
      console.error('Error saving temperature to RTDB:', error);
    }
  };

  // Function to save new temperature data to Firestore
  const saveTemperatureToFirestore = async (temperature) => {
    try {
      const docRef = await addDoc(collection(firestore, 'temperatures'), {
        temperature: parseFloat(temperature), // Ensure temperature is stored as a float
        timestamp: Date.now(),
      });
      console.log('Temperature saved to Firestore with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving temperature to Firestore:', error);
    }
  };

  return (
    <div>
      <p>Current Temperature: {currentTemperature !== null ? currentTemperature.toFixed(1) : 'Loading...'}</p>
      <button onClick={() => setIsLoading(true)} disabled={isLoading}>
        {isLoading ? 'Fetching Temperature...' : 'Get and Save Current Temperature'}
      </button>
    </div>
  );
}

export default TemperatureButton;
