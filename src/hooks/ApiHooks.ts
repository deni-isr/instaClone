import { useCallback } from 'react';
import { fetchData } from '../utils/fetch-data';
import { VisualMedia } from '../types/VisualMedia';

// Haetaan rajapintojen osoitteet ympäristömuuttujista
const MEDIA_API = import.meta.env.VITE_MEDIA_API || 'https://media2.edu.metropolia.fi/media-api/api/v1';
const AUTH_API = import.meta.env.VITE_AUTH_API || 'https://media2.edu.metropolia.fi/auth-api/api/v1';
const UPLOAD_API = import.meta.env.VITE_UPLOAD_API || 'https://media2.edu.metropolia.fi/upload-api/api/v1';

// Käyttäjän todennukseen ja istunnon luomiseen liittyvät API-kutsut.
export const useAuthentication = () => {
  const postLogin = async (inputs: object) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchData<any>(`${AUTH_API}/auth/login`, fetchOptions);
  };

  return { postLogin };
};


// Käyttäjätilien hallintaan ja rekisteröitymiseen liittyvät.
export const useUser = () => {
  const resourceUrl = `${AUTH_API}/users`;

  const postRegister = async (inputs: object) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchData<any>(resourceUrl, fetchOptions); 
  };

  const getUserByToken = useCallback(async (token: string) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return fetchData<any>(`${resourceUrl}/token`, options);
  }, [resourceUrl]);

  const deleteUser = async (token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return fetchData<any>(resourceUrl, options);
  };

  return { postRegister, getUserByToken, deleteUser };
};

// Media-julkaisuihin liittyvät API-kutsut
export const useMedia = () => {
  const getMedia = async () => {
    return fetchData<VisualMedia[]>(`${MEDIA_API}/media`);
  };

  const deleteMedia = async (media_id: number, token: string) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return fetchData<any>(`${MEDIA_API}/media/${media_id}`, fetchOptions);
  };

  // Päivittää olemassa olevan julkaisun tietoja (esim. otsikko, kuvaus) ilman tiedoston uudelleenlähetystä
  const putMedia = async (media_id: number, inputs: object, token: string) => {
    const fetchOptions = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return fetchData<any>(`${MEDIA_API}/media/${media_id}`, fetchOptions);
  };

  // Luo uuden julkaisun (Create) yhdistää tiedoston metatietoihin
  const postMedia = async (fileData: any, inputs: object, token: string) => {
    const mediaData = {
      ...fileData,
      ...inputs,
    };

    const fetchOptions = {
      method: 'POST',
      // Sisältää tokenin Authorization-headerissä ja lähettää mediaData-objektin JSON-muodossa
      headers: {
        // Token vaaditaan, jotta API tietää kuka luo julkaisun
        'Authorization': `Bearer ${token}`,
        // Content-Type on application/json, koska lähetämme mediaData-objektin JSON-muodossa
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mediaData),
    };
    return fetchData<any>(`${MEDIA_API}/media`, fetchOptions);
  };

  return { getMedia, deleteMedia, postMedia, putMedia };
};

// Tiedostojen lataukseen liittyvät API-kutsut
export const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return fetchData<any>(`${UPLOAD_API}/upload`, options);
  };

  return { postFile };
};

// Tykkäyksiin (Likes) liittyvät API-kutsut
export const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Sisältää tokenin Authorization-headerissä, jotta API tietää kuka tykkää julkaisusta
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ media_id }),
    };
    return fetchData<any>(`${MEDIA_API}/likes`, fetchOptions);
  };

  const deleteLike = async (like_id: number, token: string) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return fetchData<any>(`${MEDIA_API}/likes/${like_id}`, fetchOptions);
  };

  const getCountByMediaId = async (media_id: number) => {
    return fetchData<{ count: number }>(`${MEDIA_API}/likes/count/${media_id}`);
  };

  const getUserLike = async (media_id: number, token: string) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        // Sisältää tokenin Authorization-headerissä, jotta API tietää kuka käyttäjä hakee tykkäystietoja
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      return await fetchData<any>(`${MEDIA_API}/likes/bymedia/user/${media_id}`, fetchOptions);
    } catch (e) {
      return null; 
    }
  };

  return { postLike, deleteLike, getCountByMediaId, getUserLike };
};

// Kommentteihin (Comments) liittyvät API-kutsut
export const useComment = () => {
  const postComment = async (media_id: number, comment_text: string, token: string) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ media_id, comment_text }),
    };
    return fetchData<any>(`${MEDIA_API}/comments`, fetchOptions);
  };

  const getCommentsByMediaId = async (media_id: number) => {
    return fetchData<any[]>(`${MEDIA_API}/comments/bymedia/${media_id}`);
  };

  return { postComment, getCommentsByMediaId };
};