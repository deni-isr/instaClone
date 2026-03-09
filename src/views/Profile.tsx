import useUserStore from '../store/UserStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Grid, Settings } from 'lucide-react';

/**
 * Käyttäjäprofiilin näkymä.
 * Näyttää kirjautuneen käyttäjän tiedot ja hallintatyökalut.
 */
const Profile = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Profiilin yläosa: kuva ja tilastot */}
      <div className="flex items-center p-6 border-b border-gray-100">
        <div className="w-20 h-20 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl font-light text-white shadow-inner">
          {user.username[0].toUpperCase()}
        </div>
        <div className="ml-6">
          <h2 className="text-xl font-bold text-black leading-tight">{user.username}</h2>
          <p className="text-gray-500 text-sm mb-2">{user.email}</p>
          <div className="flex gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs font-semibold bg-gray-100 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
              <Settings size={14} /> Muokkaa
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-500 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <LogOut size={14} /> Kirjaudu ulos
            </button>
          </div>
        </div>
      </div>

      {/* Grid-näkymän välilehti (iOS-tyyli) */}
      <div className="flex justify-center border-b border-gray-100 py-2">
        <Grid size={24} className="text-blue-500" />
      </div>

      {/* Tähän tulee myöhemmin käyttäjän omat kuvat */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        <div className="aspect-square bg-gray-50 flex items-center justify-center text-[10px] text-gray-300 italic">
          Ei vielä julkaisuja
        </div>
      </div>
    </div>
  );
};

export default Profile;