import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './Register.css';

function Register() {
  const [name, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register attempt with:', name, email, password, contactNumber);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add user to Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid, // Add uid to the Firestore document
        name,
        email,
        contactNumber,
        password
      });

      alert('Registration successful.');
      navigate('/login');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        alert('The email address is already in use by another account.');
      } else {
        console.error('Error adding document: ', e);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="body"></div>
      <div className="grad"></div>
      <div className="header">
        <div>Fever<span>Scan</span></div>
      </div>
      <div className="register">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        <button className="login-btn" onClick={() => navigate('/login')}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;
