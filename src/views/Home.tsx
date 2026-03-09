import { useEffect, useState } from 'react';
import { useApi } from '../hooks/ApiHooks';
import { VisualMedia } from '../types/VisualMedia';
import MediaRow from '../components/MediaRow';

/**
 * Kotisivu, joka hakee ja näyttää kaikki julkaisut.
 * Käytämme useEffect-koukkua tietojen hakuun sivun latautuessa.
 * Julkaisut näytetään listana MediaRow-komponenttien avulla.
 */
const Home = () => {
  const { getMedia } = useApi();
  const [mediaArray, setMediaArray] = useState<VisualMedia[]>([]);

  {mediaArray.map((item) => (
  // Lisää TÄMÄ key-prop MediaRow-komponenttiin
  <MediaRow key={item.file_id} item={item} />
  ))}

  useEffect(() => {
    // Tehdään kutsu palvelimelle heti kun sivu avataan
    const fetchMedia = async () => {
      try {
        const data = await getMedia();
        setMediaArray(data);
      } catch (error) {
        console.error('Virhe median hakemisessa:', error);
      }
    };

    fetchMedia();
  }, [getMedia]);

  return (
    <div className="max-w-md mx-auto">
      {mediaArray.length > 0 ? (
        mediaArray.map((item) => (
          <MediaRow key={item.file_id} item={item} />
        ))
      ) : (
        <div className="text-center p-10 text-gray-400">
          Ladataan kuvia...
        </div>
      )}
    </div>
  );
};

export default Home;