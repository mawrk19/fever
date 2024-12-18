import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { signInWithGoogle } from './firebaseConfig'; // Import the signInWithGoogle function
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', email, password);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        sessionStorage.setItem('user', JSON.stringify(userDoc.data())); // Store user data in sessionStorage
        navigate('/home');
      } else {
        alert('User not found.');
        auth.signOut();
      }
    } catch (e) {
      console.error('Error logging in: ', e);
      alert('Error logging in.');
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
