import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Settings, LogOut } from 'lucide-react';

export default function ProfileDropdown({ className = '' }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={`relative group ${className}`}>
      <button className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg hover:shadow-glow transition-all overflow-hidden">
        <img 
          src={user?.picture || '/default-avatar.png'} 
          alt="Profile" 
          className="w-8 h-8 rounded-full object-cover"
        />
      </button>
      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
        <div className="px-4 py-3 border-b">
          <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>
        <button onClick={() => navigate('/dashboard/profile')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <User className="w-5 h-5" />
          Profile
        </button>
        <button onClick={() => navigate('/dashboard/settings')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
