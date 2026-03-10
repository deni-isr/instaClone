import useUserStore from '../store/UserStore';
import { useNavigate } from 'react-router';
import { useUser } from '../hooks/ApiHooks';

const Profile = () => {
  const { user, token, logout } = useUserStore();
  const { deleteUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    
    const isConfirmed = window.confirm(
      'Haluatko varmasti poistaa tilisi ?'
    );

    if (isConfirmed) {
      try {
        await deleteUser(token);
        alert('Tilisi on poistettu');
        handleLogout();
      } catch (error) {
        console.error('Epäonnistui:', error);
        alert('Yritä uudelleen.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center pt-10 px-6 pb-24">
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

        <button 
          onClick={handleDeleteAccount}
          className="w-full bg-red-50 text-red-500 font-semibold p-4 rounded-2xl hover:bg-red-100 active:scale-95 transition-all text-sm"
        >
          Poista tili
        </button>
      </div>
    </div>
  );
};

export default Profile;