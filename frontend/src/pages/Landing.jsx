import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, User, Lock, Bot, Database } from 'lucide-react';

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 md:px-8 lg:px-16 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-6 py-3 rounded-3xl shadow-xl border border-white/50 mb-8">
            <Bot className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">AI-Powered Government Data Hub</span>
          </div>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent leading-tight mb-8">
            Intelligent
            <span className="block bg-gradient-to-r from-accent to-purple-600">Data Hub</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
            Unlock 100+ government domains with AI insights, datasets, and intelligent search.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link
              to="/login"
              className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 text-white font-black py-6 px-12 rounded-3xl text-xl flex items-center gap-4 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 border border-white/20 max-w-sm justify-center"
            >
              <User className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Get Started - Sign In
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="group bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-6 px-12 rounded-3xl text-xl flex items-center gap-4 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 border-2 border-gray-200/50 dark:border-gray-700/50 max-w-sm justify-center backdrop-blur-xl"
            >
              <Lock className="w-6 h-6" />
              New Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Preview Stats */}
      <section className="py-32 px-4 md:px-8 lg:px-16 xl:px-24 -mt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-900/50 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          <div className="glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
            <div className="text-5xl font-black text-primary mb-4">100+</div>
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Government Domains</div>
          </div>
          <div className="glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
            <div className="text-5xl font-black text-secondary mb-4">50K+</div>
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Datasets</div>
          </div>
          <div className="glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
            <div className="text-5xl font-black text-accent mb-4">1M+</div>
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Data Resources</div>
          </div>
          <div className="glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
            <div className="text-5xl font-black text-green-500 mb-4">24%</div>
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Monthly Growth</div>
          </div>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="py-32 px-4 md:px-8 lg:px-16 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto space-y-16"
        >
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools for government data exploration and analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass backdrop-blur-xl p-10 rounded-3xl text-center group hover:shadow-3xl transition-all border border-white/20"
            >
              <Database className="w-20 h-20 text-primary mx-auto mb-6 opacity-75 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dataset Explorer</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Browse, filter, and download from 100+ government sectors.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass backdrop-blur-xl p-10 rounded-3xl text-center group hover:shadow-3xl transition-all border border-white/20"
            >
              <Bot className="w-20 h-20 text-secondary mx-auto mb-6 opacity-75 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Chatbot</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Ask questions about datasets and get instant insights.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass backdrop-blur-xl p-10 rounded-3xl text-center group hover:shadow-3xl transition-all border border-white/20"
            >
              <User className="w-20 h-20 text-accent mx-auto mb-6 opacity-75 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personal Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Track favorites, saved searches, and analysis history.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 md:px-8 lg:px-16 xl:px-24 bg-gradient-to-t from-primary/5 to-transparent">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">Ready to transform data into insights?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/login" className="bg-primary hover:bg-primary/90 text-white font-black py-6 px-12 rounded-3xl text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all flex-1 max-w-sm justify-center">
              Start Free Trial
            </Link>
            <Link to="/register" className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary text-gray-900 dark:text-white font-bold py-6 px-12 rounded-3xl text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex-1 max-w-sm justify-center">
              Create Account
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
