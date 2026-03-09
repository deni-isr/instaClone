import { AUTH_API, MEDIA_API, UPLOAD_API } from '../utils/constants';
import { VisualMedia, LoginResponse } from '../types/VisualMedia';

const useApi = () => {
  const doFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || 'Virhe pyynnössä');
    }
    return json;
  };

  /**
 * Funktio tiedoston ja sen tietojen lähettämiseen palvelimelle.
 * Vaatii Bearer-tokenin x-access-token -otsikossa.
 */
const postMedia = async (formData: FormData, token: string) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'x-access-token': token,
    },
    body: formData, // FormData sisältää tiedoston ja muut kentät (title, description)
  };
  return await doFetch<any>(UPLOAD_API + '/upload', options);
};

  // Haetaan kuvat MEDIA_API:sta
  const getMedia = async (): Promise<VisualMedia[]> => {
    return await doFetch<VisualMedia[]>(MEDIA_API + '/media');
  };

  // Kirjautuminen AUTH_API:n kautta
  const postLogin = async (credentials: object): Promise<LoginResponse> => {
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    };
    return await doFetch<LoginResponse>(AUTH_API + '/auth/login', options);
  };

  // Lisää tämä useApi-funktion sisälle:
const postUser = async (user: object) => {
  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };
  return await doFetch(AUTH_API + '/users', options);
};

// Lisää tämä useApi-funktion sisälle
const getUserByToken = async (token: string) => {
  const options: RequestInit = {
    headers: { 'x-access-token': token },
  };
  return await doFetch<LoginResponse>(AUTH_API + '/users/token', options);
};

const getLikesByMediaId = async (mediaId: number) => {
  // Varmistetaan, että ID on olemassa ja se on numero ennen kutsua
  if (!mediaId) throw new Error('media_id is missing');
  
  return await doFetch<any[]>(`${MEDIA_API}/likes/bymedia/${mediaId}`);
};

// Tykkäyksen lisääminen
const postLike = async (fileId: number, token: string) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    // KOKEILE: Jos media_id ei toimi, kokeile file_id: Number(fileId)
    body: JSON.stringify({ media_id: Number(fileId) }),
  };
  return await doFetch<any>(MEDIA_API + '/likes', options);
};

// Poistetaan tykkäys (jos käyttäjä painaa uudelleen)
const deleteLike = async (likeId: number, token: string) => {
  const options: RequestInit = {
    method: 'DELETE',
    headers: { 'x-access-token': token },
  };
  return await doFetch<any>(MEDIA_API + '/likes/' + likeId, options);
};

// Päivitä return-lauseke:
return { getMedia, postLogin, postUser, getUserByToken, postMedia, getLikesByMediaId, postLike, deleteLike };
};

export { useApi };