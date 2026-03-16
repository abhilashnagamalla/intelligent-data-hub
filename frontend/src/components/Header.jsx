import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Bell } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import DarkModeToggle from './DarkModeToggle';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
              {t('Intelligent Data Hub')}
            </h1>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-lg mx-12 hidden lg:flex">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search datasets, domains...', { defaultValue: 'Search datasets, domains...' })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 transition-colors">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button 
              className="relative p-2 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
              title="Notifications"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs flex items-center justify-center font-bold animate-pulse shadow-lg border-2 border-white/50 drop-shadow-lg">
                3
              </span>
            </button>
            <DarkModeToggle />
            <LanguageSelector />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
