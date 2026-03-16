
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HeartPulse, GraduationCap, Truck, Apple, FileBarChart, DollarSign, Database, Library, Package, Calendar, Download, Eye } from 'lucide-react';

const domainConfig = {
  health: {
    name: 'Health',
    desc: 'Healthcare datasets and analytics',
    icon: HeartPulse,
    color: 'text-red-600',
    stats: { catalogs: 24, datasets: 151, resources: 389 },
    topDatasets: ['State Health Indicators', 'Hospital Infrastructure Data', 'Disease Surveillance Dataset'],
    updated: '2 days ago',
    downloads: 530,
    views: '2.3k',
  },
  education: {
    name: 'Education',
    desc: 'Educational statistics and school data',
    icon: GraduationCap,
    color: 'text-blue-600',
    stats: { catalogs: 18, datasets: 89, resources: 245 },
    topDatasets: ['School Enrollment Stats', 'Teacher Distribution Data', 'Exam Results Dataset'],
    updated: '5 days ago',
    downloads: 289,
    views: '1.8k',
  },
  transport: {
    name: 'Transport',
    desc: 'Transportation and logistics datasets',
    icon: Truck,
    color: 'text-orange-600',
    stats: { catalogs: 15, datasets: 67, resources: 189 },
    topDatasets: ['Road Accident Data', 'Public Transport Stats', 'Vehicle Registration'],
    updated: '1 week ago',
    downloads: 412,
    views: '3.1k',
  },
  agriculture: {
    name: 'Agriculture',
    desc: 'Agriculture production and farmer data',
    icon: Apple,
    color: 'text-green-600',
    stats: { catalogs: 32, datasets: 204, resources: 567 },
    topDatasets: ['Crop Production Stats', 'Farmer Subsidy Data', 'Market Price Trends'],
    updated: '3 days ago',
    downloads: 789,
    views: '4.5k',
  },
  census: {
    name: 'Census',
    desc: 'Population and demographic data',
    icon: FileBarChart,
    color: 'text-purple-600',
    stats: { catalogs: 12, datasets: 45, resources: 123 },
    topDatasets: ['Population Census 2011', 'District Demographics', 'Migration Patterns'],
    updated: '1 month ago',
    downloads: 156,
    views: '1.2k',
  },
  finance: {
    name: 'Finance',
    desc: 'Financial and economic datasets',
    icon: DollarSign,
    color: 'text-teal-600',
    stats: { catalogs: 28, datasets: 112, resources: 334 },
    topDatasets: ['GDP State-wise', 'Bank Loan Data', 'Tax Revenue Stats'],
    updated: '4 days ago',
    downloads: 367,
    views: '2.8k',
  },
};

export default function DomainCard({ domain, onClick }) {
  const { t } = useTranslation();
  const config = domainConfig[domain.sector.toLowerCase()] || domainConfig.health;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      whileHover={{ y: -2, boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col hover:border-gray-300 dark:hover:border-gray-500"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200/50">
        <div className={`p-2.5 rounded-lg ${config.color} bg-opacity-10 border`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-lg leading-tight">{config.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{config.desc}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Database className="w-3.5 h-3.5" />
            Catalogs
          </span>
          <span className="font-semibold">{config.stats.catalogs}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Library className="w-3.5 h-3.5" />
            Datasets
          </span>
          <span className="font-semibold">{config.stats.datasets}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Package className="w-3.5 h-3.5" />
            Resources
          </span>
          <span className="font-semibold">{config.stats.resources}</span>
        </div>
      </div>

      {/* Top Datasets */}
      <div className="mb-4 space-y-1">
        <div className="font-medium text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Top Datasets</div>
        <div className="space-y-1">
          {config.topDatasets.map((dataset, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              {dataset}
            </div>
          ))}
        </div>
      </div>

      {/* Info & Button */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 mt-auto">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          {config.updated}
        </div>
        <div className="flex items-center gap-2">
          <Download className="w-3.5 h-3.5" />
          {config.downloads}
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" />
          {config.views}
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full border border-primary text-primary bg-primary/10 hover:bg-primary/20 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200"
        onClick={onClick}
      >
        View Domain →
      </motion.button>
    </motion.div>
  );
}
