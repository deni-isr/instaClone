import { Link, Outlet } from 'react-router';
import { Home, User, PlusSquare } from 'lucide-react';
import useUserStore from '../store/UserStore';

const Layout = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-black">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 px-4 py-3 flex justify-center">
        <h1 className="text-lg font-bold tracking-tight">InstaClone</h1>
      </header>

      {/* Sivun vaihtuva sisältö */}
      <main className="max-w-md mx-auto">
        <Outlet />
      </main>
      
      <nav className="bg-white/90 backdrop-blur-md border-t border-gray-200 fixed bottom-0 w-full flex justify-around p-3 pb-8">
        <Link to="/" className="text-gray-400 hover:text-black transition-colors">
          <Home size={28} strokeWidth={1.5} />
        </Link>
        
        {/* Näytetään lisäysnappi vain kirjautuneille */}
        <Link to="/upload" className="text-gray-400 hover:text-black transition-colors">
          <PlusSquare size={28} strokeWidth={1.5} />
        </Link>

        {/* Ohjataan profiiliin tai kirjautumiseen tilan mukaan */}
        <Link 
          to={user ? "/profile" : "/login"} 
          className="text-gray-400 hover:text-black transition-colors"
        >
          <User size={28} strokeWidth={1.5} />
        </Link>
      </nav>
    </div>
  );
};

export default Layout;