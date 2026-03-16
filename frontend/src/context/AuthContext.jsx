import { createContext, useState, useEffect } from "react";
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (import.meta.env.DEV) {
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
      }, 0);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
      await signInWithPopup(auth, provider);
      // User already set by listener
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    // Listener handles
  };

  return (
    <AuthContext.Provider value={{ user, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
