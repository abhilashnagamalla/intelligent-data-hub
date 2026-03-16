import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { LayoutDashboard, MessageCircle, ChevronLeft, ChevronRight, Apple, GraduationCap, HeartPulse, Truck, FileBarChart, MessageCirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const domainIcons = {
  agriculture: Apple,
  education: GraduationCap,
  health: HeartPulse,
  transport: Truck,
  finance: Truck,
  'census': FileBarChart,
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [domains, setDomains] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    api.get('/domains').then(res => setDomains(res.data)).catch(console.error);
  }, []);

  const isActive = (path) => location.pathname.includes(path);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl w-64 md:w-72 flex flex-col h-screen transition-all duration-300 border-r border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <button onClick={toggleCollapsed} className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        {!collapsed && (
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              IDH
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Intelligent Data Hub</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group hover:bg-primary/20 ${
            isActive('/dashboard') ? 'bg-primary/30 border-r-4 border-primary shadow-glow font-semibold' : 'hover:shadow-glow'
          }`}
        >
          <LayoutDashboard className="w-6 h-6 flex-shrink-0" />
          {!collapsed && <span>{t('Overview')}</span>}
        </button>

        <div className="space-y-1">
          <div className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold tracking-wider opacity-75">
            {!collapsed && t('Domains')}
          </div>
          {domains.map((domain) => {
            const Icon = domainIcons[domain.sector.toLowerCase()] || LayoutDashboard;
            return (
              <button
                key={domain.sector}
                onClick={() => navigate(`/dashboard/domain/${domain.sector}`)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group hover:bg-white/10 ${
                  isActive(`/domain/${domain.sector}`) ? 'bg-primary/20 border-r-4 border-primary font-medium' : ''
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0 opacity-80 group-hover:opacity-100" />
                {!collapsed && <span className="truncate">{domain.sector}</span>}
                {!collapsed && (
                  <div className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {domain.datasets}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/dashboard/chatbot')}
          className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group hover:bg-accent/20 ${
            isActive('/chatbot') ? 'bg-accent/30 border-r-4 border-accent shadow-glow font-semibold' : 'hover:shadow-glow'
          }`}
        >
          <MessageCirclePlus className="w-6 h-6" />
          {!collapsed && <span>{t('Domain Chatbot')}</span>}
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          {!collapsed && 'v1.0.0'}
        </div>
      </div>
    </div>
  );
}
