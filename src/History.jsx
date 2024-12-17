import React, { useState, useEffect } from 'react';
import './History.css';

function History() {
  const [temperatureHistory, setTemperatureHistory] = useState([]);

  useEffect(() => {
    // Retrieve the stored temperature data from sessionStorage
    const storedTemperature = sessionStorage.getItem('latestTemperature');
    if (storedTemperature) {
      setTemperatureHistory(prevHistory => [
        ...prevHistory,
        JSON.parse(storedTemperature),
      ]);
    }
  }, []);

  // Function to handle the deletion of a temperature entry
  const handleDelete = (timestamp) => {
    // Remove from state
    setTemperatureHistory(prevHistory => prevHistory.filter(temp => temp.timestamp !== timestamp));

    // Optionally, remove from sessionStorage if you're only using it for this session
    const storedTemperature = sessionStorage.getItem('latestTemperature');
    if (storedTemperature) {
      const parsedTemp = JSON.parse(storedTemperature);
      if (parsedTemp.timestamp === timestamp) {
        sessionStorage.removeItem('latestTemperature');
      }
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Temperature (°C)</th>
            <th>Status</th>
            <th>Timestamp</th>
            <th>Action</th> {/* Add a column for the delete button */}
          </tr>
        </thead>
        <tbody>
          {temperatureHistory.map((temp, index) => (
            <tr key={index}>
              <td>{temp.temperature.toFixed(1)} °C</td>
              <td className={temp.temperature >= 37.6 ? 'fever-status' : 'normal-status'}>
                {temp.temperature >= 37.6 ? 'Fever' : 'Normal'}
              </td>
              <td>{new Date(temp.timestamp).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(temp.timestamp)}>Delete</button> {/* Delete button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
