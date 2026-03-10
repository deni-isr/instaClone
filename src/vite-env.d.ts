/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Median hallinnan rajapinnan perusosoite */
  readonly VITE_MEDIA_API: string;
  
  /** Autentikaation ja käyttäjähallinnan rajapinnan perusosoite */
  readonly VITE_AUTH_API: string;
  
  /** Tiedostojen latauksen rajapinnan perusosoite */
  readonly VITE_UPLOAD_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}