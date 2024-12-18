import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, getDocs, collection, query, where } from 'firebase/firestore';
import { signInWithGoogle } from './firebaseConfig'; // Import the signInWithGoogle function
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const db = getFirestore(); // Firestore instance

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', email, password);

    try {
      // Query to check if the email exists in the 'users' collection
      const userQuery = query(
        collection(db, 'users'),
        where('email', '==', email),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // If the query returns a document, the credentials are valid
        const userData = querySnapshot.docs[0].data(); // Get user data
        sessionStorage.setItem('user', JSON.stringify(userData)); // Store user data in sessionStorage
        navigate('/home'); // Redirect to the home page
      } else {
        // If no document is found, credentials are invalid
        console.error('Invalid email or password');
        alert('Invalid email or password'); // Display an error message
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userData = await signInWithGoogle();
      sessionStorage.setItem('user', JSON.stringify(userData)); // Store user data in sessionStorage
      navigate('/home'); // Redirect to the home page
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user'); // Clear sessionStorage on logout
    navigate('/login');
  };

  return (
    <div className="login-page">
      <div className="body"></div>
      <div className="grad"></div>
      <div className="header">
        <div>Fever<span>Scan</span></div>
      </div>
      <div className="login">
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Sign in</button>
        </form>
        
        <button className="google-btn" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
        <button className="register-btn" onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
