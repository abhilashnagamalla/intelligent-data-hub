import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, LogIn, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import DarkModeToggle from './DarkModeToggle';
import ProfileDropdown from './ProfileDropdown';

export default function Header({ onMenuToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700 shadow-sm sticky top-0 z-40">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main row */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Hamburger — only on <lg */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Logo */}
            <h1
              className="text-base sm:text-xl md:text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow cursor-pointer hover:scale-105 transition-transform whitespace-nowrap"
              onClick={() => navigate('/')}
            >
              {/* Short name on xs, full name on sm+ */}
              <span className="sm:hidden">IDH</span>
              <span className="hidden sm:inline">{t('Intelligent Data Hub')}</span>
            </h1>
          </div>

          {/* Center: Search bar (md+) */}
          <div className="flex-1 max-w-lg mx-4 hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search datasets, domains...', { defaultValue: 'Search datasets, domains...' })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md text-sm"
              />
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Search icon on <md */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSearchExpanded(v => !v)}
              aria-label="Search"
            >
              {searchExpanded
                ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                : <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              }
            </button>

            <DarkModeToggle />
            <div className="text-gray-900 dark:text-white">
              <LanguageSelector />
            </div>

            {user ? (
              <ProfileDropdown />
            ) : (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2 bg-primary/90 hover:bg-primary text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-glow text-xs sm:text-sm whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('Login with Google')}</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded search row on mobile */}
        {searchExpanded && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder={t('Search datasets, domains...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  handleSearch(e);
                  if (e.key === 'Enter') setSearchExpanded(false);
                }}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
