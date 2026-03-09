import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/ApiHooks';
import useUserStore from '../store/UserStore';

/**
 * Kirjautumissivu, joka hoitaa käyttäjän tunnistautumisen.
 * Käytämme kustomoitua hookia API-kutsuun.
 * Onnistunut kirjautuminen tallentaa tiedot storeen.
 */
const Login: React.FC = () => {
  const { postLogin } = useApi();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ username: '', password: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Login.tsx handleSubmit-funktion sisällä:
      const loginResult = await postLogin(inputs);
      localStorage.setItem('token', loginResult.token); // Tallennetaan selaimen muistiin
      setToken(loginResult.token);
      setUser(loginResult.user);
      
      // Ohjataan käyttäjä etusivulle
      navigate('/');
    } catch (error) {
      alert('Kirjautuminen epäonnistui: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">InstaClone</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Käyttäjätunnus"
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Salasana"
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold p-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all text-sm mt-4"
          >
            Kirjaudu sisään
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;