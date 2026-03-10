import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFile, useMedia } from '../hooks/ApiHooks';
import useUserStore from '../store/UserStore';
import { Camera } from 'lucide-react';

const Upload = () => {
  const { postFile } = useFile();
  const { postMedia } = useMedia();
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [inputs, setInputs] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  /**
   * Käsittelee tiedoston valinnan ja luo siitä paikallisen esikatselukuvan (Blob URL).
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Päivittää lomakkeen tekstisyötteiden tilaa dynaamisesti.
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // Suorittaa asynkronisen, kaksivaiheisen latausprosessin.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !token) return;

    try {
      setLoading(true);

      //Ladataan fyysinen tiedosto palvelimelle
      const fileResponse = await postFile(file, token);
      
      // Varmistetaan, että palvelin palautti tiedoston tiedot
      if (!fileResponse || !fileResponse.data) {
        throw new Error('Tiedoston lataus onnistui, mutta metatietoja ei palautettu.');
      }

      //Lähetetään tiedot tietokantaan
      await postMedia(fileResponse.data, inputs, token);

      alert('Kuva on julkaistu');
      // Ohjataan käyttäjä takaisin etusivulle, mikä käynnistää syötteen päivityksen automaattisesti
      navigate('/'); 
    } catch (error) {
      console.error('virhe:', error);
      alert('Yritä uudelleen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-8 max-w-sm mx-auto pb-24">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Luo uusi julkaisu</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kuvan esikatselu- ja valinta-alue */}
        <div 
          onClick={() => document.getElementById('fileInput')?.click()}
          className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform relative group"
        >
          {preview ? (
            <>
              <img src={preview} alt="Esikatselu" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-bold text-sm">Vaihda kuva</p>
              </div>
            </>
          ) : (
            <>
              <Camera size={48} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-medium">Napauta valitaksesi kuva</p>
            </>
          )}
        </div>
        
        <input 
          id="fileInput"
          type="file" 
          accept="image/*, video/*" 
          onChange={handleFileChange} 
          className="hidden"
        />

        {/* Metatietojen syöttökentät */}
        <input
          type="text"
          name="title"
          value={inputs.title}
          placeholder="Otsikko (pakollinen)"
          required
          onChange={handleInputChange}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm text-black"
        />

        <textarea
          name="description"
          value={inputs.description}
          placeholder="Kirjoita kuvateksti..."
          onChange={handleInputChange}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm h-24 resize-none text-black"
        />

        {/* Lähetyspainike visuaalisella lataustilalla */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white font-bold p-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all text-sm disabled:bg-blue-300 flex justify-center items-center"
        >
          {loading ? (
            <span className="animate-pulse">Julkaistaan...</span>
          ) : (
            'Jaa julkaisu'
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;