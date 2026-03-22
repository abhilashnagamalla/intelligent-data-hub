import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, BarChart3, Loader2 } from 'lucide-react';
import api from '../api';

export default function CatalogCardLive({ catalog, onView }) {
  const [views, setViews] = useState(catalog.views ?? null);
  const [downloads, setDownloads] = useState(catalog.downloads ?? null);
  const [isDownloading, setIsDownloading] = useState(false);
  const encodedDatasetId = catalog.id ? encodeURIComponent(catalog.id) : '';

  useEffect(() => {
    if (!catalog.sector || !catalog.id) return;

    let active = true;

    const loadStats = () => {
      api
        .get(`/datasets/${catalog.sector}/${encodedDatasetId}/stats`)
        .then((res) => {
          if (!active) return;
          setViews((prev) => res.data?.stats?.views ?? prev ?? 0);
          setDownloads((prev) => res.data?.stats?.downloads ?? prev ?? 0);
        })
        .catch(() => {
          if (!active) return;
        });
    };

    loadStats();
    const intervalId = window.setInterval(loadStats, 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [catalog.sector, catalog.id, encodedDatasetId]);

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (isDownloading || !catalog.sector || !catalog.id) return;
    setIsDownloading(true);

    try {
      const dlRes = await api.post(`/datasets/${catalog.sector}/${encodedDatasetId}/download`);
      setDownloads(dlRes.data?.downloads ?? ((downloads ?? 0) + 1));

      const rawRes = await api.get(`/datasets/${catalog.sector}/${encodedDatasetId}/raw`);
      const blob = new Blob([rawRes.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', catalog.id.includes('.csv') ? catalog.id : `${catalog.id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col group hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200/30">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg leading-tight line-clamp-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {catalog.title}
            </h3>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`ml-2 p-2 rounded-lg transition-all flex-shrink-0 ${
            isDownloading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-500 hover:text-primary hover:bg-primary/10'
          }`}
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download CSV"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </motion.button>
      </div>

      <div className="mb-5 flex-1 space-y-1">
        <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
          {catalog.organization || catalog.department || 'Government of India'}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
          {catalog.description || 'Comprehensive dataset providing detailed statistics and metrics for analysis.'}
        </p>
      </div>

      <div className="flex items-center gap-6 pb-5 mb-5 border-b border-gray-200/30">
        <div className="text-center">
          <div className="font-bold text-base sm:text-lg text-green-600 mb-0.5">
            {views === null ? '--' : views}
          </div>
          <div className="flex items-center gap-1 justify-center text-xs font-medium text-gray-500 uppercase tracking-wide">
            <Eye className="w-3 h-3" />
            Views
          </div>
        </div>

        <div className="text-center">
          <div className="font-bold text-base sm:text-lg text-blue-600 mb-0.5">
            {downloads === null ? '--' : downloads}
          </div>
          <div className="flex items-center gap-1 justify-center text-xs font-medium text-gray-500 uppercase tracking-wide">
            <Download className="w-3 h-3" />
            Downloads
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onView(catalog)}
        className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 sm:py-3.5 px-6 rounded-xl shadow-lg hover:shadow-glow hover:shadow-xl transition-all duration-200 text-sm"
      >
        {'View Details ->'}
      </motion.button>
    </motion.div>
  );
}
