import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Lock, Check } from 'lucide-react';

export default function Register() {
  const { user, registerWithEmail, googleLogin, loading, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    if (!termsAccepted) {
      setFormError('Please accept the terms and conditions');
      return;
    }
    clearError();
    setFormError('');
    try {
      await registerWithEmail(email, password);
    } catch (err) {
      // Error handled in context
    }
  };

  const handleGoogleRegister = async () => {
    clearError();
    try {
      await googleLogin();
    } catch (err) {
      // Error handled in context
    }
  };

  const validateForm = () => {
    return email && password && confirmPassword && password === confirmPassword && termsAccepted && password.length >= 6;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="text-white text-xl">Creating account...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/Screenshot 2026-03-16 190230.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/60 pointer-events-none" />
      <div className="relative z-10 w-full h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass backdrop-blur-xl bg-white/20 rounded-3xl p-12 max-w-md w-full shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto"
      >
        <div className="text-center mb-12">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-28 h-28 bg-gradient-to-r from-white via-primary to-accent rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-glow"
          >
            <User className="w-16 h-16 text-white drop-shadow-lg" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6 leading-tight">
            Join Intelligent Data Hub
          </h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-white/95 font-medium"
          >
            Create your account to unlock government data insights
          </motion.p>
        </div>

        {(error || formError) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/90 text-white p-4 rounded-2xl mb-6 text-center font-medium border border-red-400/50 backdrop-blur-sm"
          >
            {formError || error}
          </motion.div>
        )}

        <form onSubmit={handleEmailRegister} className="space-y-6 mb-6">
          <div>
            <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/80 hover:bg-white text-gray-900 px-12 py-4 rounded-2xl font-semibold text-lg border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-glow"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/80 hover:bg-white text-gray-900 px-12 py-4 rounded-2xl font-semibold text-lg border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-glow"
              placeholder="Create strong password"
              required
            />
          </div>

          <div>
            <label className="block text-white/90 font-semibold mb-3 flex items-center gap-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/80 hover:bg-white text-gray-900 px-12 py-4 rounded-2xl font-semibold text-lg border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-glow"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="flex items-start gap-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-6 h-6 bg-white/80 rounded-xl flex items-center justify-center border-2 border-white/30 group-hover:border-white/50 transition-all duration-200 backdrop-blur-sm shadow-lg">
                <Check className={`w-4 h-4 text-primary transition-opacity ${termsAccepted ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className="text-white/90 text-sm font-medium leading-relaxed max-w-xs">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-white/90 underline decoration-2 transition-colors">Terms & Conditions</a>
              </span>
            </label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="sr-only"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,255,255,0.3)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!validateForm() || loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 text-white font-black py-5 px-8 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-glow transition-all duration-300 border border-white/30 text-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Create Account
          </motion.button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-1 text-white/70 font-semibold tracking-wider">or</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,255,255,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full bg-white/90 hover:bg-white text-gray-900 font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-4 shadow-2xl hover:shadow-glow transition-all duration-300 border border-white/30 text-lg backdrop-blur-sm mt-6"
        >
          <User className="w-7 h-7" />
          Continue with Google
        </motion.button>

        <p className="text-center mt-8 text-white/70 text-sm">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="font-semibold text-white hover:text-primary transition-colors"
          >
            Sign in here
          </button>
        </p>
      </motion.div>
      </div>
    </div>
  );
}
