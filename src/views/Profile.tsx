// src/views/Profile.tsx
import useUserStore from '../store/UserStore';
import { useNavigate } from 'react-router-dom';

/**
 * Käyttäjäprofiilin näkymä.
 * Käsittelee istunnon päättämisen (uloskirjautuminen) opettajan arkkitehtuurin mukaisesti,
 * tyhjentäen sekä globaalin tilan että selaimen välimuistin.
 */
const Profile = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  /**
   * Päättää käyttäjän istunnon ja ohjaa takaisin kirjautumisnäkymään.
   */
  const handleLogout = () => {
    // 1. Kutsutaan Zustand-storen logout-funktiota, joka tyhjentää tilan ja localStoragen
    logout();
    
    // 2. Ohjataan käyttäjä välittömästi kirjautumissivulle
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center pt-10 px-6">
      <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-3xl font-light text-gray-400 border border-gray-200">
        {user.username ? user.username[0].toUpperCase() : '?'}
      </div>
      
      <h2 className="text-xl font-bold text-black">{user.username}</h2>
      <p className="text-gray-500 mb-10 text-sm">{user.email}</p>
      
      <div className="w-full max-w-xs space-y-4">
        <button 
          onClick={handleLogout}
          className="w-full bg-gray-100 text-black font-semibold p-4 rounded-2xl active:scale-95 transition-all text-sm"
        >
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
};

export default Profile;