import { useEffect, useState, useCallback } from 'react';
import { useMedia } from '../hooks/ApiHooks';
import MediaRow from '../components/MediaRow';
import { VisualMedia } from '../types/VisualMedia';
import useUserStore from '../store/UserStore';

const Home = () => {
  const { getMedia } = useMedia();
  const user = useUserStore((state) => state.user);
  const [mediaArray, setMediaArray] = useState<VisualMedia[]>([]);

  const fetchMedia = useCallback(async () => {
    try {
      const allMedia = await getMedia();
      // Järjestetään media uusimmasta vanhimpaan, jotta uudet julkaisut näkyvät ensin
      const sortedMedia = allMedia.sort((a, b) => {
        const idA = a.media_id || a.file_id || 0;
        const idB = b.media_id || b.file_id || 0;
        return idB - idA;
      });
      
      if (user) {
        // Pakotetaan tunnisteet numeroiksi tarkan vertailun takaamiseksi
        const currentUserId = Number(user.user_id);
        
        const myMedia = sortedMedia.filter(item => Number(item.user_id) === currentUserId);
        const othersMedia = sortedMedia.filter(item => Number(item.user_id) !== currentUserId).slice(0, 5);
        
        setMediaArray([...myMedia, ...othersMedia]);
      } else {
        setMediaArray(sortedMedia.slice(0, 5));
      }
    } catch (error) {
      console.error('virhe:', error);
    }
  }, [getMedia, user]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return (
    <div className="flex flex-col pb-20">
      {mediaArray.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-sm">Ladataan ...</p>
      ) : (
        mediaArray.map((item) => {
          const mId = item.media_id || item.file_id;
          return mId ? <MediaRow key={mId} item={item} onDelete={fetchMedia} /> : null;
        })
      )}
    </div>
  );
};

export default Home;