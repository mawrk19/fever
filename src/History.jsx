import React, { useEffect, useState } from 'react';
import { firestore } from './firebaseConfig'; // Import firestore from firebaseConfig
import { collection, getDocs, writeBatch } from 'firebase/firestore'; // Import collection, getDocs, and writeBatch from firebase/firestore
import './History.css'; // Import the updated CSS

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'temperatures'));
        const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  const deleteAllHistory = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'temperatures'));
      const batch = writeBatch(firestore); // Use writeBatch to create a batch
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setHistory([]);
      console.log('All history deleted successfully.');
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  return (
    <div className="table-container">
      <table className="static-size-table"> {/* Add className for static size */}
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{entry.temperature}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="delete-all" onClick={deleteAllHistory}>Delete All</button>
    </div>
  );
}

export default History;
