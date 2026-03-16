import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';
import CatalogCard from '../components/CatalogCard';
import Chatbot from './Chatbot';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { Filter, TrendingUp, Download, MapPin, Calendar, Search, Bot } from 'lucide-react';

export default function DomainPage() {
  const { sector } = useParams();
  const [stats, setStats] = useState({});
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('catalogs');
  const [chatOpen, setChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setTimeout(() => {
        setShowTooltip(true);
      }, 2000);
      setTimeout(() => {
        setShowTooltip(false);
      }, 6000);
    };
    cycle();
    const interval = setInterval(cycle, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/datasets/${sector}`).then(res => {
      const datasets = res.data.datasets || res.data || [];
      setStats({ catalogs: 1, datasets: datasets.length, resources: datasets.length });
      setCatalogs(datasets.map(filename => ({
        id: filename,
        title: filename.replace(/_/g, ' ').replace(/\\.csv$/, ''),
        datasets_count: 1,
        sector
      })));
      setLoading(false);
    }).catch(err => {
      console.error('Domain page error:', err);
      setLoading(false);
    });
  }, [sector]);

  const chartData = [
    { name: 'Telangana', value: 540 },
    { name: 'Andhra Pradesh', value: 420 },
    { name: 'Karnataka', value: 380 },
    { name: 'Maharashtra', value: 450 },
    { name: 'Kerala', value: 320 },
  ];

  const pieData = [
    { name: 'Production', value: 60 },
    { name: 'Yield', value: 25 },
    { name: 'Area', value: 15 },
  ];

  const COLORS = ['#2563EB', '#4F46E5', '#9333EA', '#10B981', '#F59E0B'];

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setShowTooltip(false), 300);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[70vh]">Loading domain...</div>;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="glass p-8 rounded-3xl lg:col-span-1">
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {sector}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Explore {stats.datasets || 0} datasets
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-3xl font-black text-primary">{stats.datasets || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Catalogs</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-3xl font-black text-accent">{stats.resources || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Resources</div>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="glass p-8 rounded-3xl lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">{t('Quick Filters')}</h2>
            <div className="flex items-center gap-2 ml-auto">
              <MapPin className="w-5 h-5" />
              <select className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl px-4 py-2 border border-white/30">
                <option>All States</option>
                <option>Telangana</option>
              </select>
              <Calendar className="w-5 h-5" />
              <select className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl px-4 py-2 border border-white/30">
                <option>All Years</option>
                <option>2023</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button 
          className={`pb-2 px-1 border-b-4 font-semibold transition-all ${activeTab === 'catalogs' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('catalogs')}
        >
          Catalogs
        </button>
        <button 
          className={`pb-2 px-1 border-b-4 font-semibold transition-all ${activeTab === 'visualizations' ? 'border-secondary text-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('visualizations')}
        >
          Visualizations
        </button>
        <button 
          className={`pb-2 px-1 border-b-4 font-semibold transition-all ${activeTab === 'weekly' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly Updated
        </button>
      </div>

      {/* Content */}
      {activeTab === 'catalogs' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {catalogs.map((catalog, index) => (
            <CatalogCard
              key={catalog.id || index}
              catalog={catalog}
              onView={() => navigate(`/domain/${sector}/${catalog.id}`)}
              onDownload={() => console.log('Download', catalog)}
            />
          ))}
        </motion.div>
      )}

      {activeTab === 'visualizations' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {/* Bar Chart */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">State-wise Production</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="glass p-8 rounded-3xl lg:col-span-1 lg:row-span-2">
            <h3 className="text-2xl font-bold mb-6">Data Types Distribution</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.map((d, i) => ({ ...d, year: 2020 + i }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#9333EA" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {activeTab === 'weekly' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Weekly catalogs stub */}
          {[...Array(8)].map((_, i) => (
            <CatalogCard key={i} catalog={{ title: 'Weekly Dataset ' + (i+1), datasets_count: 12 + i }} />
          ))}
        </motion.div>
      )}

      {/* Floating Chatbot Button with Tooltip */}
      <div className="fixed bottom-12 right-8 z-[60] relative">
        <motion.button
          className="w-16 h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-2xl hover:shadow-glow border-4 border-white/20 flex items-center justify-center relative z-10"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ 
            scale: 1, 
            y: [0, -4, 0],
            transition: {
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(true)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Bot className="w-7 h-7 drop-shadow-lg" />
        </motion.button>
        <motion.div
          className="absolute left-full ml-4 -mt-2 text-white text-base font-semibold px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-2xl border border-white/20 before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-l-primary z-20"
          initial={{ scale: 0, opacity: 0, x: 10 }}
          animate={showTooltip ? { scale: 1, opacity: 1, x: 0 } : { scale: 0.8, opacity: 0, x: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Ask me anything about the dataset
        </motion.div>
      </div>

      {/* Chatbot Overlay */}
      {chatOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl">
            <Chatbot 
              onClose={() => setChatOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
