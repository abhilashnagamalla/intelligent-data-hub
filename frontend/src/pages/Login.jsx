import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogIn, User } from 'lucide-react';

export default function Login() {
  const { user, googleLogin, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    await googleLogin();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass backdrop-blur-xl bg-white/20 rounded-3xl p-12 max-w-md w-full shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto animate-pulse-glow"
      >
        <div className="text-center mb-12">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-28 h-28 bg-gradient-to-r from-white via-primary to-accent rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-glow"
          >
            <LogIn className="w-16 h-16 text-white drop-shadow-lg" />
          </motion.div>
            <h1 
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Intelligent Data Hub
          </h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-white/95 font-medium"
          >
            Transforming Government Data into Intelligent Insights
          </motion.p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,255,255,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white/90 hover:bg-white text-gray-900 font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-4 shadow-2xl hover:shadow-glow transition-all duration-300 border border-white/30 text-lg backdrop-blur-sm"
        >
          <User className="w-7 h-7" />
          Continue with Google
        </motion.button>

        <p className="text-center mt-8 text-white/70 text-sm">
          Secure login with your Google account
        </p>
      </motion.div>
    </div>
  );
}
