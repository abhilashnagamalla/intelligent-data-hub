import { motion } from 'framer-motion';
import { Download, Eye, Share2, Bell, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CatalogCard({ catalog, onView, onDownload }) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col group hover:border-primary/50 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {catalog.title}
            </h3>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            onClick={onDownload}
            title="Download ZIP"
          >
            <Download className="w-4.5 h-4.5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-gray-600 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-all"
            title="Share"
          >
            <Share2 className="w-4.5 h-4.5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
          </motion.button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 flex-1 space-y-1">
        <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
          {catalog.organization || catalog.department || 'Government of India'}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
          {catalog.description || 'Comprehensive dataset providing detailed agricultural statistics and metrics for analysis.'}
        </p>
      </div>

      {/* Stats Grid - 5 items layout */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-3 pb-6 mb-6 border-b border-gray-200/30">



        {/* Views */}
        <div className="text-center">
          <div className="font-bold text-lg text-green-600 mb-0.5">{catalog.views || 0}</div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Views</div>
        </div>

        {/* Downloads */}
        <div className="text-center">
          <div className="font-bold text-lg text-blue-600 mb-0.5">{catalog.downloads || 0}</div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Downloads</div>
        </div>

        {/* Updated */}
        <div className="text-center">
          <div className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">
            {catalog.updated_date ? new Date(catalog.updated_date).toLocaleDateString('short') : 'Recent'}
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Updated</div>
        </div>

        {/* Published */}
        <div className="text-center">
          <div className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">
            {catalog.published_date ? new Date(catalog.published_date).toLocaleDateString('short') : '2023'}
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Published</div>
        </div>
      </div>

      {/* View Details Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onView(catalog)}
        className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-glow hover:shadow-xl transition-all duration-200 text-sm"
      >
        View Details →
      </motion.button>
    </motion.div>
  );
}

