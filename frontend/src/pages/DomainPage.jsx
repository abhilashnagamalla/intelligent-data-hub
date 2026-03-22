import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';
import CatalogCard from '../components/CatalogCardLive';
import Chatbot from './Chatbot';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { MapPin, Bot } from 'lucide-react';

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  let pages;

  if (currentPage <= 3) {
    pages = [1, 2, 3, 4, totalPages];
  } else if (currentPage >= totalPages - 2) {
    pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
  }

  const items = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      items.push(`ellipsis-${index}`);
    }
    items.push(page);
  });

  return items;
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(currentPage, totalPages);
  const buttonBaseClass = 'flex h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';
  const buttonHoverClass = 'hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-300';
  const buttonDisabledClass = 'cursor-not-allowed opacity-45 shadow-none';

  return (
    <div className="mt-10 flex justify-end">
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="First page"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${buttonBaseClass} ${currentPage === 1 ? buttonDisabledClass : buttonHoverClass}`}
        >
          {'<<'}
        </button>
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonBaseClass} ${currentPage === 1 ? buttonDisabledClass : buttonHoverClass}`}
        >
          {'<'}
        </button>

        {items.map((item) => {
          if (typeof item === 'string') {
            return (
              <span
                key={item}
                className={`${buttonBaseClass} pointer-events-none px-5 text-slate-400 dark:text-slate-500`}
              >
                ...
              </span>
            );
          }

          const isActive = currentPage === item;

          return (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              onClick={() => onPageChange(item)}
              className={`${buttonBaseClass} ${
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white shadow-[0_14px_32px_rgba(37,99,235,0.3)]'
                  : buttonHoverClass
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonBaseClass} ${currentPage === totalPages ? buttonDisabledClass : buttonHoverClass}`}
        >
          {'>'}
        </button>
        <button
          type="button"
          aria-label="Last page"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${buttonBaseClass} ${currentPage === totalPages ? buttonDisabledClass : buttonHoverClass}`}
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
}

function DatasetChartPreview({ sector, catalog, index }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const encodedDatasetId = encodeURIComponent(catalog.id);

  useEffect(() => {
    api.get(`/datasets/${sector}/${encodedDatasetId}`)
      .then(res => {
         setChartData(res.data.charts);
         setLoading(false);
      })
      .catch(err => {
         console.error(err);
         setLoading(false);
      });
  }, [sector, catalog.id, encodedDatasetId]);

  if (loading) {
    return (
      <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col min-h-[300px] sm:min-h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500 font-medium tracking-wide">Fetching real dataset metrics...</p>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return null; // Do not include visualizations which cannot be produced
  }

  const chartInfo = chartData[0]; // defaults to the first chart generated by backend
  
  // Transform x and y array to Recharts format
  const formattedData = chartInfo.x.map((x_val, i) => ({
    name: String(x_val).substring(0, 15), 
    value: Number(chartInfo.y[i]) || 0
  }));

  // Choose best visualization technique based on dataset dimensions
  const numPoints = formattedData.length;
  let chartType = 0; // Bar chart default
  if (numPoints <= 5 && !chartInfo.x.some(x_val => String(x_val).match(/^(19|20)\d{2}$/))) {
    chartType = 1; // Pie chart for small data
  } else if (numPoints > 10 || chartInfo.x.some(x_val => String(x_val).match(/^(19|20)\d{2}$/))) {
    chartType = 2; // Line chart for timelines/large dimensions
  }

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#9333EA', '#EF4444', '#EC4899', '#06B6D4', '#8B5CF6'];

  return (
    <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col min-h-[300px] sm:min-h-[400px]">
      <h3 className="text-xl font-bold mb-2 truncate text-black dark:text-white transition-colors" title={catalog.title}>{catalog.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-semibold uppercase tracking-wider">Metric: {chartInfo.label}</p>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 0 ? (
            <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.2)" />
              <XAxis dataKey="name" stroke="#888888" tick={{ fill: '#888888', fontSize: 11 }} />
              <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} />
              <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={1000} />
            </BarChart>
          ) : chartType === 1 ? (
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={formattedData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={1000}
                label={({ name }) => name}
                labelLine={false}
              >
                {formattedData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} />
            </PieChart>
          ) : (
            <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.2)" />
              <XAxis dataKey="name" stroke="#888888" tick={{ fill: '#888888', fontSize: 11 }} />
              <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="value" stroke="#9333EA" strokeWidth={4} dot={{ r: 4, fill: "#9333EA" }} activeDot={{ r: 7 }} isAnimationActive={true} animationDuration={1000} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DomainPage() {
  const { sector } = useParams();
  const [stats, setStats] = useState({});
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('catalogs');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [chatOpen, setChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedState, setSelectedState] = useState('All States');

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Puducherry", "Chandigarh"
  ];

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
    setCurrentPage(1);
    setSelectedState('All States');
    setLoading(true);
    api.get(`/datasets/${sector}`).then(res => {
      const datasets = res.data.datasets || res.data || [];
      setStats({ catalogs: datasets.length, datasets: datasets.length });
      setCatalogs(datasets.map(filename => ({
        id: filename,
        title: filename.replace(/_/g, ' ').replace(/\.csv$/, ''),
        datasets_count: 1,
        sector
      })));
      setLoading(false);
    }).catch(err => {
      console.error('Domain page error:', err);
      setLoading(false);
    });
  }, [sector]);

  // Filtering mechanics
  const filteredCatalogs = catalogs.filter(cat => {
    let matchState = true;
    if (selectedState !== 'All States') {
      matchState = cat.title.toLowerCase().includes(selectedState.toLowerCase());
    }
    return matchState;
  });
  const totalPages = Math.ceil(filteredCatalogs.length / itemsPerPage);
  const paginatedCatalogs = filteredCatalogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setShowTooltip(false), 300);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[70vh]">Loading domain...</div>;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Stats */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl sm:col-span-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t(sector.charAt(0).toUpperCase() + sector.slice(1))}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-4 sm:mb-8">
            {t('Explore')} {stats.datasets || 0} {t('datasets')}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-xl sm:text-3xl font-black text-primary">{stats.catalogs || 0}</div>
              <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{t('Catalogs')}</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-xl sm:text-3xl font-black text-accent">{stats.datasets || 0}</div>
              <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{t('Datasets')}</div>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl sm:col-span-2">
          <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">{t('Quick Filters')}</h2>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 text-gray-700 dark:text-gray-300" />
              <select 
                value={selectedState} 
                onChange={(e) => { setSelectedState(e.target.value); setCurrentPage(1); }} 
                className="flex-1 sm:flex-none bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl px-3 sm:px-4 py-2 border border-white/30 text-gray-900 dark:text-white text-sm"
              >
                <option value="All States">{t('All States')}</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{t(state)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button 
          className={`pb-2 px-1 border-b-4 font-semibold transition-all ${activeTab === 'catalogs' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
          onClick={() => { setActiveTab('catalogs'); setCurrentPage(1); }}
        >
          {t('Catalogs')}
        </button>
        <button 
          className={`pb-2 px-1 border-b-4 font-semibold transition-all ${activeTab === 'visualizations' ? 'border-secondary text-secondary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
          onClick={() => { setActiveTab('visualizations'); setCurrentPage(1); }}
        >
          {t('Visualizations')}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'catalogs' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="flex flex-col gap-6"
        >
          {filteredCatalogs.length === 0 ? (
            <div className="text-center p-12 text-gray-500 font-medium">No datasets found matching the current filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCatalogs.map((catalog, index) => (
                  <CatalogCard
                    key={catalog.id || index}
                    catalog={catalog}
                    onView={() => navigate(`/domain/${sector}/${encodeURIComponent(catalog.id)}`)}
                    onDownload={() => console.log('Download', catalog)}
                  />
                ))}
              </div>
              <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </motion.div>
      )}

      {activeTab === 'visualizations' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="flex flex-col gap-6"
        >
          {filteredCatalogs.length === 0 ? (
            <div className="text-center p-12 text-gray-500 font-medium">No datasets found matching the current filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedCatalogs.map((catalog, index) => (
                  <DatasetChartPreview key={catalog.id || index} sector={sector} catalog={catalog} index={index} />
                ))}
              </div>
              <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </motion.div>
      )}

      {/* Floating Chatbot Button with Tooltip */}
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
        {/* Tooltip: appears above button on all screens */}
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-2xl border border-white/20 whitespace-nowrap"
          initial={{ scale: 0, opacity: 0, x: 20 }}
          animate={showTooltip ? { scale: 1, opacity: 1, x: 0 } : { scale: 0.8, opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Ask me anything about the dataset
        </motion.div>
      </div>

      {/* Chatbot Overlay */}
      {chatOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
            <Chatbot 
              onClose={() => setChatOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
