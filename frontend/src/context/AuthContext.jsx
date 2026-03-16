import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from '../firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import axios from 'axios';

/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check URL param ?mock=false to disable mock auth for testing real flow
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === '/login' || currentPath === '/register';
    const useMockAuth = import.meta.env.DEV && !urlParams.get('mock') && !isAuthPage;

    if (isAuthPage) {
      localStorage.removeItem('user');
    }

    if (useMockAuth) {
      setTimeout(() => {
        const mockUser = {
          id: 'demo',
          email: 'demo@example.com',
          name: 'Demo User',
          picture: 'https://vitejs.dev/logo.svg',
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
      }, 500); // Slight delay to show loading
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const storedUser = localStorage.getItem('user');
      if (currentUser) {
        const userData = {
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
          picture: currentUser.photoURL,
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setError(null);
      } else if (storedUser) {
        // If we have a user stored from backend JWT login, keep it and avoid clearing
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const googleLogin = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google login error:', error);
      let message = 'Google login failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Login cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Popup blocked. Please allow popups for this site.';
      }
      setError(message);
      setLoading(false);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', { email, password });
      const token = response.data.access_token;
      // Decode token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        id: payload.user_id,
        email: payload.email,
        name: payload.username,
        token: token
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      let message = 'Login failed. Please try again.';
      if (error.response && error.response.data && error.response.data.detail) {
        message = error.response.data.detail;
      }
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email, password, username) => {
    setLoading(true);
    try {
      setError(null);
      await axios.post('/api/auth/register', { email, username, password });
      setError(`✓ Registration Successful! Account created for ${email}. Please sign in.`);
    } catch (error) {
      let message = 'Registration failed. Please try again.';
      if (error.response && error.response.data && error.response.data.detail) {
        message = error.response.data.detail;
      }
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      googleLogin, 
      loginWithEmail,
      registerWithEmail,
      logout, 
      loading, 
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}
