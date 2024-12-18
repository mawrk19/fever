import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TemperatureButton from './TemperatureButton'; // Import TemperatureButton component
import './Home.css'; // Import Home CSS

function Home() {
  const [temperature, setTemperature] = useState(null);

  const addTemperatureToHistory = (newTemperature) => {
    // Function to add temperature to history
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
    </div>
  );
}

export default Home;
