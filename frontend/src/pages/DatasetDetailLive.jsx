import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, BarChart3, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DatasetDetailLive() {
  const { sector, filename } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [dataset, setDataset] = useState(null);
  const [rawCsv, setRawCsv] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();
  const encodedFilename = filename ? encodeURIComponent(filename) : '';

  useEffect(() => {
    if (!sector || !filename) return;

    const visitedDatasets = JSON.parse(localStorage.getItem('visited_datasets') || '[]');
    if (!visitedDatasets.includes(filename)) {
      localStorage.setItem('visited_datasets', JSON.stringify([...visitedDatasets, filename]));
    }

    let active = true;
    const viewMarkerKey = `dataset-view:${location.key}:${sector}:${filename}`;
    const alreadyCounted = sessionStorage.getItem(viewMarkerKey) === '1';

    const loadStats = () =>
      api.get(`/datasets/${sector}/${encodedFilename}/stats`).then((res) => {
        if (!active) return;
        setDataset((prev) => ({ ...(prev || {}), stats: res.data?.stats || {} }));
      });

    if (!alreadyCounted) {
      sessionStorage.setItem(viewMarkerKey, '1');
    }

    const statsRequest = alreadyCounted
      ? api.get(`/datasets/${sector}/${encodedFilename}/stats`)
      : api.post(`/datasets/${sector}/${encodedFilename}/view`);

    Promise.all([
      statsRequest,
      api.get(`/datasets/${sector}/${encodedFilename}/raw`),
    ])
      .then(([statsRes, rawRes]) => {
        if (!active) return;
        setDataset({ stats: statsRes.data?.stats || {} });
        setRawCsv(rawRes.data || '');
        setErrorMessage('');
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Dataset detail/raw fetch error:', err);
        const message =
          err?.response?.status === 404
            ? 'The requested dataset could not be located in the backend datasets folder.'
            : 'The dataset exists, but its details could not be loaded right now.';
        setErrorMessage(message);
        setLoading(false);
      });

    const intervalId = window.setInterval(() => {
      loadStats().catch(() => {});
    }, 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [sector, filename, encodedFilename, location.key]);

  const handleDownload = async () => {
    if (isDownloading || !sector || !filename) return;
    setIsDownloading(true);

    try {
      const res = await api.post(`/datasets/${sector}/${encodedFilename}/download`);
      setDataset((prev) => ({
        ...(prev || {}),
        stats: {
          ...(prev?.stats || {}),
          downloads: res.data?.downloads ?? ((prev?.stats?.downloads || 0) + 1),
        },
      }));

      const blob = new Blob([rawCsv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.includes('.csv') ? filename : `${filename}.csv`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dataset || errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500">
        <FileText className="w-16 h-16 opacity-50 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dataset not found</h2>
        <p className="text-lg mb-8 text-center max-w-2xl">{errorMessage}</p>
        <motion.button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-glow transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {'<-'} {t('Back to Catalogs')}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-1 hover:bg-white/20 rounded-xl transition-all flex-shrink-0 self-start"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-2 break-words">
              {filename.replace(/_/g, ' ').replace(/\.csv$/, '')}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-blue-100 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl">
                <BarChart3 className="w-4 h-4" />
                <span className="font-semibold text-sm sm:text-base">
                  {t(sector.charAt(0).toUpperCase() + sector.slice(1))} {t('Domain')}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`font-semibold px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base ${
                isDownloading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:shadow-xl hover:bg-blue-50'
              }`}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="w-4 sm:w-5 h-4 sm:h-5" />
              {isDownloading ? t('Downloading...') : t('Download CSV')}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">Dataset Summary</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          This dataset provides statistical information related to the {sector} domain. It includes structured data collected from official government sources and can be used for analysis, visualization, and policy insights.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Dataset Info</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">File Format</span>
              <span className="font-bold text-primary">CSV</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('Downloads')}</span>
              <span className="font-bold text-blue-600">{dataset.stats?.downloads || 0}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-primary mb-1">{dataset.stats?.rows || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300 uppercase tracking-wide">Rows</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-accent mb-1">{dataset.stats?.columns?.length || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300 uppercase tracking-wide">Columns</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-green-600 mb-1">{dataset.stats?.views || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300 uppercase tracking-wide">Views</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="text-2xl font-black text-blue-600 mb-1">{dataset.stats?.downloads || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300 uppercase tracking-wide">Downloads</div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl"
      >
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Data
        </h3>
        <div className="bg-black/90 text-green-400 p-6 rounded-2xl overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre shadow-inner">
          {rawCsv || t('Search datasets, domains...')}
        </div>
      </motion.section>
    </div>
  );
}
