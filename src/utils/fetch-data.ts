// Tämä tiedosto sisältää apufunktion datan hakemiseen API:sta, joka käsittelee virheitä ja palauttaa JSON-muodossa olevan datan.
export const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    const errorData = json as { message: string };
    throw new Error(errorData.message || `Virhe: ${response.status} ${response.statusText}`);
  }
  return json as T;
};