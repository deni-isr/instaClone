import { useEffect, useState, useCallback } from 'react';
import { Heart, Trash2, Pencil, Check, X, MessageCircle } from 'lucide-react'; // Lisätty MessageCircle
import { useLike, useMedia, useComment } from '../hooks/ApiHooks';
import useUserStore from '../store/UserStore';
import { MEDIA_BASE_URL } from '../utils/constants';

interface MediaRowProps {
  item: any;
  onDelete?: () => void;
}

const MediaRow = ({ item, onDelete }: MediaRowProps) => {
  const { postLike, deleteLike, getCountByMediaId, getUserLike } = useLike();
  const { deleteMedia, putMedia } = useMedia();
  const { postComment, getCommentsByMediaId } = useComment(); // Otettu käyttöön kommentti-hook
  
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);

  // Tykkäyksien tila
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userLikeId, setUserLikeId] = useState<number | null>(null);

  // Muokkaustilan tila
  const [isEditing, setIsEditing] = useState(false);
  const [editInputs, setEditInputs] = useState({
    title: item.title || '',
    description: item.description || ''
  });

  // Kommenttien tila (UUSI)
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const mId = item.media_id || item.file_id;
  const imageUrl = item.filename.startsWith('http') ? item.filename : MEDIA_BASE_URL + item.filename;
  const isOwnPost = user && Number(user.user_id) === Number(item.user_id);

  // --- LIKES LOGIIKKA ---
  const updateLikes = useCallback(async () => {
    if (!mId) return;
    try {
      const countData = await getCountByMediaId(mId);
      setLikeCount(countData.count);

      if (token) {
        const likeData = await getUserLike(mId, token);
        if (likeData && likeData.like_id) {
          setUserLiked(true);
          setUserLikeId(likeData.like_id);
        } else {
          setUserLiked(false);
          setUserLikeId(null);
        }
      }
    } catch (e) {
      console.error('Tykkäysten päivitys epäonnistui');
    }
  }, [mId, token, getCountByMediaId, getUserLike]);

  useEffect(() => {
    updateLikes();
  }, [updateLikes]);

  const handleLike = async () => {
    if (!token || !mId) return;
    try {
      if (userLiked && userLikeId) {
        await deleteLike(userLikeId, token);
      } else {
        await postLike(mId, token);
      }
      await updateLikes();
    } catch (e) {
      console.warn('Tykkäys epäonnistui:', e);
    }
  };

  // --- CRUD LOGIIKKA ---
  const handleDelete = async () => {
    if (!token || !mId) return;
    const isConfirmed = window.confirm('Haluatko varmasti poistaa tämän julkaisun?');
    if (!isConfirmed) return;

    try {
      await deleteMedia(mId, token);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Julkaisun poisto epäonnistui:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!token || !mId) return;
    try {
      await putMedia(mId, editInputs, token);
      setIsEditing(false);
      item.title = editInputs.title; // Päivitetään lokaalisti, jotta muutos näkyy heti
      item.description = editInputs.description;
    } catch (error) {
      console.error('Päivitys epäonnistui:', error);
      alert('Tietojen päivitys epäonnistui.');
    }
  };


  // Kommenttien logiikka
  const fetchComments = useCallback(async () => {
    if (!mId) return;
    try {
      const data = await getCommentsByMediaId(mId);
      setComments(data || []);
    } catch (e) {
      console.error('Kommenttien haku epäonnistui', e);
    }
  }, [mId, getCommentsByMediaId]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  const handlePostComment = async () => {
    if (!token || !mId || newComment.trim() === '') return;
    try {
      await postComment(mId, newComment, token);
      setNewComment(''); // Tyhjennetään input
      fetchComments(); // Haetaan uudet kommentit heti
    } catch (e) {
      console.error('Kommentin lähetys epäonnistui');
    }
  };

  return (
    <div className="bg-white mb-6 border-b border-gray-100 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-[10px] font-bold">
            {item.user_id}
          </div>
          <span className="font-bold text-xs uppercase">Käyttäjä {item.user_id}</span>
        </div>
        
        // 
        {isOwnPost && !isEditing && (
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 p-1">
              <Pencil size={18} />
            </button>
            <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-1">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Kuva */}
      <div className="w-full aspect-square bg-gray-50 overflow-hidden">
        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-3 w-full">
        {/* Toimintopainikkeet (Tykkäys & Kommentti) */}
        <div className="flex space-x-4 mb-3 mt-1 items-center">
          <Heart 
            size={28} 
            onClick={handleLike}
            className={`cursor-pointer transition-all duration-200 active:scale-125 ${
              userLiked ? 'fill-red-500 text-red-500' : 'text-black fill-transparent'
            }`} 
          />
          <MessageCircle 
            size={28} 
            onClick={() => setShowComments(!showComments)}
            className="cursor-pointer text-black transition-all duration-200 hover:text-gray-600 active:scale-125"
          />
        </div>
        
        <p className="text-sm font-bold mb-2 text-black">{likeCount} tykkäystä</p>

        {/* Muokkaustila TAI normaali teksti */}
        {isEditing ? (
          <div className="space-y-2 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <input 
              type="text" 
              value={editInputs.title}
              onChange={(e) => setEditInputs({...editInputs, title: e.target.value})}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Otsikko"
            />
            <textarea 
              value={editInputs.description}
              onChange={(e) => setEditInputs({...editInputs, description: e.target.value})}
              className="w-full p-2 text-sm border border-gray-300 rounded resize-none h-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Kuvaus"
            />
            <div className="flex space-x-2 pt-1">
              <button onClick={handleSaveEdit} className="flex-1 bg-blue-500 text-white text-xs font-bold py-2 rounded flex items-center justify-center">
                <Check size={14} className="mr-1" /> Tallenna
              </button>
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-black text-xs font-bold py-2 rounded flex items-center justify-center">
                <X size={14} className="mr-1" /> Peruuta
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-800 break-words whitespace-pre-wrap w-full">
            <span className="font-bold mr-2 text-black">{item.title}</span>
            <span>{item.description}</span>
          </div>
        )}

        {/* Kommenttiosio (Aukeaa kun MessageCircle-ikonia painetaan) */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="max-h-32 overflow-y-auto space-y-2 mb-3 pr-2">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-400">Ei kommentteja vielä.</p>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.comment_id} className="text-sm leading-tight">
                    <span className="font-bold mr-2 text-xs">Käyttäjä {comment.user_id}</span>
                    <span className="text-gray-700">{comment.comment_text}</span>
                  </div>
                ))
              )}
            </div>

            {token ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Lisää kommentti..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
                <button 
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="text-blue-500 font-bold text-sm px-2 disabled:text-blue-200 transition-colors"
                >
                  Julkaise
                </button>
              </div>
            ) : (
              <p className="text-xs text-red-400">Kirjaudu sisään</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaRow;