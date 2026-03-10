// src/hooks/ApiHooks.ts
import { useCallback } from 'react';
import { fetchData } from '../utils/fetch-data';
import { VisualMedia } from '../types/VisualMedia';

// Haetaan rajapintojen osoitteet ympäristömuuttujista opettajan (Matti P.) standardin mukaisesti.
const MEDIA_API = import.meta.env.VITE_MEDIA_API || 'https://media2.edu.metropolia.fi/media-api/api/v1';
const AUTH_API = import.meta.env.VITE_AUTH_API || 'https://media2.edu.metropolia.fi/auth-api/api/v1';
const UPLOAD_API = import.meta.env.VITE_UPLOAD_API || 'https://media2.edu.metropolia.fi/upload-api/api/v1';

/**
 * Käyttäjän todennukseen ja istunnon luomiseen liittyvät API-kutsut.
 */
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

/**
 * Käyttäjätilien hallintaan ja rekisteröitymiseen liittyvät API-kutsut.
 */
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

/**
 * Mediatiedostojen (julkaisujen) hallintaan liittyvät API-kutsut.
 * Sisältää syötteen lataamisen, omien julkaisujen poistamisen sekä
 * metatietojen tallentamisen tietokantaan.
 */
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

  /**
   * Kaksivaiheisen latausprosessin toinen vaihe:
   * Yhdistää Upload-rajapinnan palauttamat tiedostotiedot käyttäjän syöttämiin 
   * metatietoihin ja tallentaa lopullisen julkaisun tietokantaan.
   */
  const postMedia = async (fileData: any, inputs: object, token: string) => {
    const mediaData = {
      ...fileData,
      ...inputs,
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mediaData),
    };
    return fetchData<any>(`${MEDIA_API}/media`, fetchOptions);
  };

  return { getMedia, deleteMedia, postMedia };
};

/**
 * Fyysisten tiedostojen (kuvat/videot) siirtämiseen (Upload) liittyvät API-kutsut.
 */
export const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Huomio: FormData-oliota käytettäessä selain asettaa Content-Type -otsikon ja
    // boundary-arvon automaattisesti. Sitä ei saa asettaa manuaalisesti tässä.
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

/**
 * Tykkäyksiin (Likes) ja vuorovaikutukseen liittyvät API-kutsut.
 */
export const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      return await fetchData<any>(`${MEDIA_API}/likes/bymedia/user/${media_id}`, fetchOptions);
    } catch (e) {
      // Mikäli käyttäjä ei ole vielä tykännyt julkaisusta, rajapinta saattaa
      // palauttaa virheen. Palautetaan neutraali null virhetilan sijaan.
      return null; 
    }
  };

  return { postLike, deleteLike, getCountByMediaId, getUserLike };
};