import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);
  // const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="text-3xl font-bold mb-8">Profile</div>
      <div className="glass p-8 rounded-2xl">
        <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">{user.name}</h2>
        <p className="text-center text-gray-500 mb-6">{user.email}</p>
        <p className="text-center text-sm text-gray-400">Last login: {new Date(user.lastLogin).toLocaleString()}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="glass p-6 rounded-xl">
          <h3 className="font-semibold mb-2">Datasets Explored</h3>
          <div className="text-3xl font-bold">42</div>
        </div>
        <div className="glass p-6 rounded-xl">
          <h3 className="font-semibold mb-2">Domains Visited</h3>
          <div className="text-3xl font-bold">6</div>
        </div>
      </div>
    </div>
  );
}
