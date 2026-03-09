import { useEffect, useState } from 'react';
import { VisualMedia } from '../types/VisualMedia';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { useApi } from '../hooks/ApiHooks';
import useUserStore from '../store/UserStore';
import { MEDIA_BASE_URL } from '../utils/constants';

interface MediaRowProps {
  item: VisualMedia;
}

/**
 * MediaRow-komponentti näyttää yksittäisen kuvan tai videon syötteessä.
 * Sisältää tykkäystoiminnallisuuden ja iOS-tyylisen ulkoasun.
 */
const MediaRow = ({ item }: MediaRowProps) => {
  const { getLikesByMediaId, postLike } = useApi();
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);

  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  // Rakennetaan kuvan osoite oikein (estetään tupla-URL)
  const imageUrl = item.filename.startsWith('http') 
    ? item.filename 
    : MEDIA_BASE_URL + item.filename;

  // Haetaan tykkäykset komponentin latautuessa
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likes = await getLikesByMediaId(item.file_id);
        setLikeCount(likes.length);
        
        // Tarkistetaan, onko nykyinen käyttäjä jo tykännyt tästä
        if (user) {
          const found = likes.some((like: any) => like.user_id === user.user_id);
          setUserLiked(found);
        }
      } catch (e) {
        console.error('Tykkäysten haku epäonnistui:', e);
      }
    };
    fetchLikes();
  }, [item.file_id, getLikesByMediaId, user]);

  /**
   * Käsittelee tykkäyspainikkeen painalluksen.
   * Lähettää tiedon API:lle ja päivittää käyttöliittymän heti.
   */
  const handleLike = async () => {
    if (!token) {
      alert('Kirjaudu sisään tykätäksesi!');
      return;
    }

    try {
      // Käytetään item.file_id, koska API odottaa numeerista ID:tä
      await postLike(item.file_id, token);
      
      // Päivitetään tila vain, jos haku onnistui
      if (!userLiked) {
        setLikeCount((prev) => prev + 1);
        setUserLiked(true);
      }
    } catch (e) {
      console.log('Tykkäys epäonnistui (ehkä olet jo tykännyt):', e);
    }
  };

  return (
    <div className="bg-white mb-6 border-b border-gray-100 last:border-0">
      {/* Käyttäjäpalkki */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full mr-3 flex items-center justify-center text-[10px] font-bold text-white">
            ID
          </div>
          <span className="font-semibold text-xs text-black">User {item.user_id}</span>
        </div>
        <MoreHorizontal size={18} className="text-gray-400" />
      </div>

      {/* Media-sisältö */}
      <div className="aspect-square w-full bg-gray-50 overflow-hidden flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500?text=Kuva-virhe';
          }}
        />
      </div>

      {/* Vuorovaikutuspalkki */}
      <div className="p-3">
        <div className="flex items-center space-x-4 mb-2">
          <Heart 
            size={26} 
            onClick={handleLike}
            className={`transition-all duration-200 cursor-pointer active:scale-125 ${
              userLiked ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-black stroke-[1.5]'
            }`} 
          />
          <MessageCircle size={26} className="text-black stroke-[1.5]" />
          <Send size={26} className="text-black stroke-[1.5]" />
        </div>
        
        {/* Tekstisisältö */}
        <div className="px-1 space-y-1">
          <p className="text-sm font-bold text-black">{likeCount} tykkäystä</p>
          <p className="text-sm leading-tight text-gray-800">
            <span className="font-bold mr-2 text-black">User {item.user_id}</span>
            {item.title}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaRow;