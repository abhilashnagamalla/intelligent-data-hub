import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthCard from '../components/AuthCard';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';

export default function Login() {
  const { user, googleLogin, loginWithEmail, registerWithEmail, loading, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ form: '' });
  useEffect(() => {
    if (error) {
      setErrors({ form: error });
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
    setErrors({ form: '' });
    // Ensure password is hidden when switching tabs
    setShowPassword(false);
    // Clear form data when switching tabs
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }, [tab, clearError]);

  const validateForm = () => {
    const newErrors = { form: '' };
    if (!formData.email || !formData.password) {
      newErrors.form = 'Please fill all required fields';
      setErrors(newErrors);
      return false;
    }
    if (tab === 'register') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.form = 'Please enter a valid email address';
        setErrors(newErrors);
        return false;
      }

      if (!formData.username.trim()) {
        newErrors.form = 'Username is required';
        setErrors(newErrors);
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.form = 'Passwords do not match';
        setErrors(newErrors);
        return false;
      }
      if (formData.password.length < 6) {
        newErrors.form = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (tab === 'login') {
        await loginWithEmail(formData.email, formData.password);
      } else {
        await registerWithEmail(formData.email, formData.password, formData.username);
        // After successful registration, clear form and switch to login
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setShowPassword(false);
        setTimeout(() => setTab('login'), 1500);
      }
    } catch (err) {
      // Error handled in context
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors.form) setErrors({ form: '' });
    if (error) clearError();
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      // Handled in context
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 flex items-center justify-center p-4">
      <AuthCard 
        tab={tab}
        setTab={setTab}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        loading={loading}
        showPassword={showPassword}
        togglePassword={togglePassword}
        googleLogin={handleGoogleLogin}
        onChangeEmail={handleInputChange('email')}
        onChangeUsername={handleInputChange('username')}
        onChangePassword={handleInputChange('password')}
        onChangeConfirmPassword={handleInputChange('confirmPassword')}
      />
    </div>
  );
}
