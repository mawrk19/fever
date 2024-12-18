import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, applyActionCode } from 'firebase/auth';
import axios from 'axios';

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const email = params.get('email');
      if (email) {
        try {
          await axios.post('/api/verify-email', { email });
          // Handle success (e.g., show a success message)
        } catch (error) {
          // Handle error (e.g., show an error message)
        }
      }
    };
    verifyEmail();

    const query = new URLSearchParams(location.search);
    const oobCode = query.get('oobCode');
    const name = query.get('name');
    const email = query.get('email');
    const contactNumber = query.get('contactNumber');
    const password = query.get('password');

    if (oobCode) {
      applyActionCode(auth, oobCode)
        .then(async () => {
          const user = auth.currentUser;
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            name,
            email,
            contactNumber,
            password,
            status: 'active' // Set status to active
          }, { merge: true }); // Merge to update existing document
          alert('Email verified and account activated successfully.');
          navigate('/login');
        })
        .catch((error) => {
          console.error('Error verifying email: ', error);
          alert('Error verifying email.');
        });
    }
  }, [auth, db, location, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>Verifying your email...</p>
    </div>
  );
}

export default VerifyEmail;
