// src/views/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication, useUser } from '../hooks/ApiHooks'; // HUOM: Päivitetyt opettajan hookit
import useUserStore from '../store/UserStore';

/**
 * Kirjautumisnäkymä (Login).
 * Käsittelee käyttäjän todennuksen (autentikaatio) hyödyntäen uutta
 * modulaarista hook-arkkitehtuuria (useAuthentication).
 */
const Login = () => {
  // Tuodaan tarvittavat funktiot ja tilanhallinta
  const { postLogin } = useAuthentication();
  const { getUserByToken } = useUser();
  const { setUser, setToken } = useUserStore();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  /**
   * Päivittää lomakkeen tilan käyttäjän syötteen perusteella.
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  /**
   * Käsittelee kirjautumislomakkeen lähetyksen asynkronisesti.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      // Suoritetaan kirjautuminen ja noudetaan token
      const loginResult = await postLogin(inputs);
      
      if (loginResult && loginResult.token) {
        // Tallennetaan token selaimen paikalliseen muistiin (localStorage)
        localStorage.setItem('token', loginResult.token);
        setToken(loginResult.token);

        // Haetaan ja tallennetaan käyttäjän tiedot tokenin avulla
        const userData = await getUserByToken(loginResult.token);
        if (userData && userData.user) {
          setUser(userData.user);
        }

        // 4. Ohjataan käyttäjä onnistuneen kirjautumisen jälkeen etusivulle
        navigate('/');
      }
    } catch (e) {
      console.error('Kirjautumisvirhe:', e);
      setError('Kirjautuminen epäonnistui.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20 px-6">
      <h2 className="text-2xl font-bold mb-6 text-black">Kirjaudu sisään</h2>
      
      {error && (
        <div className="w-full max-w-xs bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Käyttäjätunnus"
          required
          onChange={handleInputChange}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm text-black"
        />
        <input
          type="password"
          name="password"
          placeholder="Salasana"
          required
          onChange={handleInputChange}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm text-black"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold p-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all text-sm"
        >
          Kirjaudu
        </button>
      </form>
    </div>
  );
};

export default Login;