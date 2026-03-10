/**
 * Opettajan mallin mukainen yleiskäyttöinen apufunktio API-kutsujen suorittamiseen.
 * Käsittelee automaattisesti HTTP-virheet ja palauttaa datan halutussa tyypissä.
 */
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