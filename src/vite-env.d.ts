/// <reference types="vite/client" />

/**
 * Ympäristömuuttujien (Environment Variables) tyyppimäärittelyt Vite-sovelluskehykselle.
 * Tämä laajentaa oletusarvoista ImportMeta-objektia ja kertoo TypeScript-kääntäjälle
 * tarkalleen, mitä ominaisuuksia (properties) import.meta.env sisältää.
 * Tämä ratkaisee TS2339-tyyppivirheen lopullisesti.
 */
interface ImportMetaEnv {
  /** Median hallinnan rajapinnan perusosoite */
  readonly VITE_MEDIA_API: string;
  
  /** Autentikaation ja käyttäjähallinnan rajapinnan perusosoite */
  readonly VITE_AUTH_API: string;
  
  /** Tiedostojen latauksen (Upload) rajapinnan perusosoite */
  readonly VITE_UPLOAD_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}