// src/components/MediaRow.tsx
import { useEffect, useState, useCallback } from 'react';
import { VisualMedia } from '../types/VisualMedia';
import { Heart, Trash2 } from 'lucide-react';
import { useLike, useMedia } from '../hooks/ApiHooks'; // Käytetään opettajan hookeja
import useUserStore from '../store/UserStore';
import { MEDIA_BASE_URL } from '../utils/constants';

interface MediaRowProps {
  item: VisualMedia;
  onDelete?: () => void;
}

/**
 * Yksittäisen mediaelementin komponentti.
 * Päivitetty opettajan standardin mukaiseksi: 
 * - Tykkäysten poisto (DELETE) toimii tallennetun like_id:n avulla.
 * - Tykkäysten kokonaismäärä haetaan erillisellä API-kutsulla.
 */
const MediaRow = ({ item, onDelete }: MediaRowProps) => {
  const { postLike, deleteLike, getCountByMediaId, getUserLike } = useLike();
  const { deleteMedia } = useMedia();
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);

  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userLikeId, setUserLikeId] = useState<number | null>(null);

  const mId = item.media_id || item.file_id;
  const imageUrl = item.filename.startsWith('http') ? item.filename : MEDIA_BASE_URL + item.filename;

  /**
   * Hakee tykkäysten ajantasaisen tilan palvelimelta
   */
  const updateLikes = useCallback(async () => {
    if (!mId) return;
    try {
      // Haetaan tykkäysten kokonaismäärä
      const countData = await getCountByMediaId(mId);
      setLikeCount(countData.count);

      // Tarkistetaan, onko kirjautunut käyttäjä jo tykännyt tästä julkaisusta
      if (token) {
        const likeData = await getUserLike(mId, token);
        if (likeData && likeData.like_id) {
          setUserLiked(true);
          setUserLikeId(likeData.like_id); // Otetaan like_id talteen poistoa varten
        } else {
          setUserLiked(false);
          setUserLikeId(null);
        }
      }
    } catch (e) {
      console.error('Tykkäystietojen päivitys epäonnistui:', e);
    }
  }, [mId, token, getCountByMediaId, getUserLike]);

  useEffect(() => {
    updateLikes();
  }, [updateLikes]);

  /**
   * Käsittelee tykkäyspainikkeen painalluksen (Toggle-toiminnallisuus).
   */
  const handleLike = async () => {
    if (!token || !mId) return;

    try {
      if (userLiked && userLikeId) {
        // Jos tykkäys on jo olemassa, poistetaan se
        await deleteLike(userLikeId, token);
      } else {
        // Muussa tapauksessa lisätään uusi tykkäys
        await postLike(mId, token);
      }
      // Päivitetään tila onnistuneen API-kutsun jälkeen
      await updateLikes();
    } catch (e) {
      console.warn('Tykkäystapahtuman epäonnistui:', e);
    }
  };

  const handleDelete = async () => {
    if (!token || !mId) return;
    const isConfirmed = window.confirm('Haluatko varmasti poistaa tämän julkaisun pysyvästi?');
    if (!isConfirmed) return;

    try {
      await deleteMedia(mId, token);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Poisto epäonnistui:', error);
    }
  };

  const isOwnPost = user && Number(user.user_id) === Number(item.user_id);

  return (
    <div className="bg-white mb-6 border-b border-gray-100 pb-4">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-[10px] font-bold">
            {item.user_id}
          </div>
          <span className="font-bold text-xs uppercase">Käyttäjä {item.user_id}</span>
        </div>
        {isOwnPost && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-1">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="w-full aspect-square bg-gray-50 overflow-hidden">
        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-3 w-full">
        <div className="flex space-x-4 mb-3 mt-1">
          <Heart 
            size={28} 
            onClick={handleLike}
            className={`cursor-pointer transition-all duration-200 active:scale-125 ${
              userLiked ? 'fill-red-500 text-red-500' : 'text-black fill-transparent'
            }`} 
          />
        </div>
        
        <div className="px-1 w-full overflow-hidden">
          <p className="text-sm font-bold mb-1 text-black">{likeCount} tykkäystä</p>
          <div className="text-sm text-gray-800 break-words whitespace-pre-wrap w-full">
            <span className="font-bold mr-2 text-black">{item.title}</span>
            <span>{item.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaRow;