import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { motion } from "framer-motion";
import DomainCard from '../components/DomainCard';
import Chatbot from './Chatbot';
import { Bot } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isIntro, setIsIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        setIsIntro(false);
      }, 4000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    api.get('/domains').then(res => {
      setDomains(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Dashboard load error:', err);
      setLoading(false);
    });
  }, []);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => { if (!isIntro) setShowTooltip(false); };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-4xl font-black text-primary mb-1 sm:mb-2">{domains.length}</div>
            <div className="text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs sm:text-sm">{t('Domains')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl font-black text-secondary mb-1 sm:mb-2">{domains.reduce((sum, d) => sum + (d.datasets || 0), 0)}</div>
            <div className="text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs sm:text-sm">{t('Datasets')}</div>
          </div>
        </div>
      </motion.div>

      {/* Domains Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 sm:w-2 h-8 sm:h-12 bg-gradient-to-b from-primary to-secondary rounded-full" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            {t('Explore Domains')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {domains.map((domain) => (
            <DomainCard
              key={domain.sector}
              domain={domain}
              onClick={() => navigate(`/domain/${domain.sector}`)}
            />
          ))}
        </div>
      </motion.section>

      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 sm:bottom-12 right-4 sm:right-8 z-[60] flex flex-col items-end gap-2">
        <motion.button
          className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-2xl hover:shadow-glow border-2 sm:border-4 border-white/20 flex items-center justify-center"
          initial={{ scale: 0, rotate: -10 }}
          animate={{
            scale: 1,
            y: [0, -4, 0],
            transition: { y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(true)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Bot className="w-5 sm:w-7 h-5 sm:h-7 drop-shadow-lg" />
        </motion.button>

        <motion.div
          className="bg-slate-800/95 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold shadow-2xl whitespace-nowrap max-w-[200px] sm:max-w-xs border border-slate-600/50 origin-right text-slate-100"
          initial={{ scale: 0, x: 20, opacity: 0 }}
          animate={showTooltip ? { scale: 1, x: 0, opacity: 1 } : { scale: 0, x: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          Ask me anything abt the dataset
        </motion.div>
      </div>

      {/* Chatbot Overlay */}
      {chatOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
            <Chatbot onClose={() => setChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
