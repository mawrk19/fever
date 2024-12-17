import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TemperatureButton from './TemperatureButton'; // Import TemperatureButton component
import './Home.css'; // Import Home CSS

function Home() {
  const [temperature, setTemperature] = useState(null);
  const [history, setHistory] = useState([]); // State to store history data

  const addTemperatureToHistory = (newTemperature) => {
    setHistory((prevHistory) => [...prevHistory, newTemperature]);
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="temperature-display">
        <h2>Current Temperature: {temperature !== null ? `${temperature}°C` : 'N/A'}</h2>
        <TemperatureButton 
          setTemperature={setTemperature} 
          addTemperatureToHistory={addTemperatureToHistory} 
        />
      </div>
      {/* Pass history to History component */}
    </div>
  );
}

export default Home;
