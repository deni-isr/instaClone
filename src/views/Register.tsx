import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApi } from '../hooks/ApiHooks';

const Register: React.FC = () => {
  const { postUser } = useApi();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: '', password: '', email: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await postUser(inputs);
      alert('Käyttäjä luotu!');
      navigate('/login');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">Luo tili</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Käyttäjätunnus"
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Sähköposti"
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
            Rekisteröidy
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Onko sinulla jo tili?{' '}
          <span onClick={() => navigate('/login')} className="text-blue-500 font-semibold cursor-pointer">
            Kirjaudu sisään
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;