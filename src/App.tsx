import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect, useState } from 'react';
import Layout from './views/Layout';
import Home from './views/Home';
import Login from './views/Login';
import Profile from './views/Profile';
import Upload from './views/Upload';
import useUserStore from './store/UserStore';
import { useUser } from './hooks/ApiHooks';

const App = () => {
  // Noudetaan getUserByToken-funktio uudesta useUser-hookista
  const { getUserByToken } = useUser();
  const { setUser, setToken, logout } = useUserStore();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Käytetään useEffectiä istunnon palauttamiseen sovelluksen käynnistyessä
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          // Validoidaan token ja haetaan käyttäjätiedot
          const userData = await getUserByToken(savedToken);
          
          if (userData && userData.user) {
            setUser(userData.user);
            setToken(savedToken);
          } else {
            throw new Error('Käyttäjätietoja ei voitu vahvistaa.');
          }
        } catch (error) {
          console.error('Istunnon palauttaminen epäonnistui:', error);
          // Mikäli token on vanhentunut tai virheellinen, puhdistetaan tila
          logout(); 
        }
      }
      // Lopetetaan lataustilan näyttäminen riippumatta siitä, onnistuiko kirjautuminen
      setIsCheckingSession(false);
    };

    restoreSession();
  }, [getUserByToken, setUser, setToken, logout]);

  // Näytetään neutraali latausnäkymä, kunnes istunnon tila on varmistettu
  if (isCheckingSession) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 font-medium">
        Ladataan sovellusta...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;