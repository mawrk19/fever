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

  // Function to handle the deletion of all temperature entries
  const handleDeleteAll = () => {
    setTemperatureHistory([]);
    sessionStorage.removeItem('latestTemperature');
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Temperature (°C)</th>
            <th>Status</th>
            <th>Timestamp</th>
            <th>Action</th>
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
                {/* Individual delete button removed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="delete-all" onClick={handleDeleteAll}>Delete All</button>
    </div>
  );
}

export default History;
