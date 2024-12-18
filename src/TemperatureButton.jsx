import React, { useState } from 'react';
import { database } from './firebaseConfig'; // Import database from firebaseConfig
import { ref, get, set } from 'firebase/database'; // Import ref, get, and set from firebase/database
import { firestore } from './firebaseConfig'; // Import firestore from firebaseConfig
import { collection, addDoc } from 'firebase/firestore'; // Import collection and addDoc from firebase/firestore

function TemperatureButton({ setTemperature, addTemperatureToHistory }) {
  const [isLoading, setIsLoading] = useState(false); // State to track if the request is ongoing

  // Function to fetch the latest temperature data from RTDB
  const getCurrentTemperature = async () => {
    if (isLoading) return; // Prevent multiple clicks if already loading
    
    setIsLoading(true); // Set loading state to true
    
    try {
      const tempRef = ref(database, 'temperatures');
      const snapshot = await get(tempRef);
      if (snapshot.exists()) {
        const temperatures = snapshot.val();
        console.log('Fetched Temperatures:', temperatures);

        // Extract the latest entry
        const keys = Object.keys(temperatures);
        const latestKey = keys[keys.length - 1];
        const latestTemperature = temperatures[latestKey];
        console.log('Latest Temperature Data:', latestTemperature);

        if (latestTemperature?.temperature && latestTemperature?.timestamp) {
          // Ensure the fetched temperature is treated as a float
          let temperature = parseFloat(latestTemperature.temperature);

          // Remove the small decimal variation
          // const randomDecimal = (Math.random() * 0.7 + 0.1).toFixed(1); // Random decimal between 0.1 and 0.8
          // temperature += parseFloat(randomDecimal); // Add the variation to the temperature

          setTemperature(temperature); // Set the fetched temperature in Home
          addTemperatureToHistory({ // Add fetched temperature to the history
            temperature: temperature,
            timestamp: Date.now(),
          });

          // Store the temperature in session storage
          sessionStorage.setItem('latestTemperature', JSON.stringify({
            temperature: temperature,
            timestamp: Date.now(),
          }));

          // Save the temperature to Firestore and RTDB
          saveTemperature(temperature);
          saveTemperatureToFirestore(temperature);
        } else {
          console.error('Invalid temperature data structure:', latestTemperature);
        }
      } else {
        console.log('No temperature data available.');
      }
    } catch (error) {
      console.error('Error getting temperature:', error);
    } finally {
      setIsLoading(false); // Set loading state back to false after the request completes
    }
  };

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
    <button onClick={getCurrentTemperature} disabled={isLoading}>
      {isLoading ? 'Fetching Temperature...' : 'Get and Save Current Temperature'}
    </button>
  );
}

export default TemperatureButton;
