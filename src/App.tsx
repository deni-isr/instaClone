import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './views/Layout';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Profile from './views/Profile';
import Upload from './views/Upload';
import { useEffect } from 'react';
import useUserStore from './store/UserStore';
import { useApi } from './hooks/ApiHooks';

/**
 * Sovelluksen pääkomponentti, joka hallitsee reititystä.
 * Täällä määritellään, mikä näkymä näytetään milläkin URL-osoitteella.
 */
const App = () => {
  const { getUserByToken } = useApi();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  // Tarkistetaan käyttäjän istunto, kun sovellus käynnistyy
  useEffect(() => {
    const checkToken = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const userData = await getUserByToken(savedToken);
          setUser(userData.user);
          setToken(savedToken);
        } catch (e) {
          console.log('Istunto vanhentunut');
          localStorage.removeItem('token');
        }
      }
    };
    checkToken();
  }, [getUserByToken, setUser, setToken]);

  return (
    <Router>
      <Routes>
        {/* Layout toimii raamina kaikille sivuille */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;