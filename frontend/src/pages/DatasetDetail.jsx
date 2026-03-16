import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, BarChart3, Calendar, Eye, FileText } from 'lucide-react';

export default function DatasetDetail() {
  const { sector, filename } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/datasets/${sector}/${filename}`).then(res => {
      setDataset(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Dataset detail error:', err);
      setLoading(false);
    });
  }, [sector, filename]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500">
        <FileText className="w-16 h-16 opacity-50 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dataset not found</h2>
        <p className="text-lg mb-8">The requested dataset could not be located.</p>
        <motion.button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-glow transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Catalogs
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header - Soft blue gradient like data.gov.in */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-start gap-6 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-white/20 rounded-xl transition-all flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-black leading-tight mb-2 line-clamp-1">
              {filename.replace(/_/g, ' ').replace(/\.csv$/, '')}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-6">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl">
                <BarChart3 className="w-4 h-4" />
                <span className="font-semibold">{sector.toUpperCase()} Domain</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Published {dataset.published_date ? new Date(dataset.published_date).toLocaleDateString() : '2023'}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Last updated {dataset.updated_date ? new Date(dataset.updated_date).toLocaleDateString() : 'Recent'}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all flex items-center gap-2"
              onClick={onDownload || (() => console.log('Download', filename))}
            >
              <Download className="w-5 h-5" />
              Download CSV
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dataset Summary</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          This dataset provides statistical information related to the {sector} domain. It includes structured data collected from official government sources and can be used for analysis, visualization, and policy insights. The data contains comprehensive metrics covering production trends, regional comparisons, and temporal patterns suitable for advanced data analysis.
        </p>
      </motion.section>

      {/* Resource Details */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            Resource Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">File Format</span>
              <span className="font-bold text-primary">CSV</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">File Size</span>
              <span className="font-bold text-green-600">{dataset.size || '2.4 MB'}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Downloads</span>
{dataset.downloads || 1200}
            </div>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Last Updated</span>
              <span className="font-mono text-sm font-semibold">{dataset.updated_date ? new Date(dataset.updated_date).toLocaleDateString() : 'Recent'}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-primary mb-1">{dataset.rows || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Rows</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-accent mb-1">{dataset.columns?.length || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Columns</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-green-600 mb-1">{dataset.views || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Views</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-blue-600 mb-1">{dataset.downloads || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Downloads</div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

