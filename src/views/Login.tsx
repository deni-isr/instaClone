import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/ApiHooks';
import useUserStore from '../store/UserStore';

const Login: React.FC = () => {
  const { postLogin } = useAuthentication();
  const { setToken, setUser } = useUserStore();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: '', password: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const loginResult = await postLogin(inputs);
      
      // Tallennetaan token selaimeen, jotta F5 ei kirjaa ulos:
      localStorage.setItem('token', loginResult.token); 
      
      setToken(loginResult.token);
      setUser(loginResult.user);
      navigate('/'); 
    } catch (error) {
      alert('Kirjautuminen epäonnistui. Tarkista tunnukset.');
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">Kirjaudu sisään</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Käyttäjätunnus"
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Salasana"
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold p-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all text-sm mt-4"
          >
            Kirjaudu
          </button>
        </form>
        
        {/* Linkki rekisteröitymiseen */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Eikö sinulla ole tiliä?{' '}
          <span onClick={() => navigate('/register')} className="text-blue-500 font-semibold cursor-pointer hover:underline">
            Luo tili tästä
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;