import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/ApiHooks';
import useUserStore from '../store/UserStore';
import { Camera } from 'lucide-react';

const Upload = () => {
  const { postMedia } = useApi();
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [inputs, setInputs] = useState({ title: '', description: '' });
  const [preview, setPreview] = useState<string>('');

  // Käsitellään tiedoston valinta ja esikatselu
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !token) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', inputs.title);
      formData.append('description', inputs.description);

      await postMedia(formData, token);
      alert('Kuva ladattu onnistuneesti!');
      navigate('/'); // Palataan etusivulle katsomaan uutta kuvaa
    } catch (error) {
      alert('Lataus epäonnistui: ' + (error as Error).message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Uusi julkaisu</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Esikatselualue */}
        <div 
          onClick={() => document.getElementById('fileInput')?.click()}
          className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        >
          {preview ? (
            <img src={preview} alt="Esikatselu" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera size={48} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-medium">Valitse kuva</p>
            </>
          )}
        </div>
        
        <input 
          id="fileInput"
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
        />

        <input
          type="text"
          name="title"
          placeholder="Otsikko..."
          required
          onChange={handleInputChange}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
        />

        <textarea
          name="description"
          placeholder="Kirjoita kuvateksti..."
          onChange={handleInputChange}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm h-24 resize-none"
        />

        <button
          type="submit"
          disabled={!file}
          className="w-full bg-blue-500 text-white font-bold p-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all text-sm disabled:bg-gray-200"
        >
          Jaa julkaisu
        </button>
      </form>
    </div>
  );
};

export default Upload;