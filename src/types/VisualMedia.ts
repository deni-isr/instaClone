/**
 * Määritellään mediaobjektin tyyppi.
 * Tämä auttaa TypeScriptiä ymmärtämään, mitä tietoja kuvasta on saatavilla.
 */
export interface VisualMedia {
  file_id: number;
  user_id: number;
  filename: string;
  filesize: number;
  title: string;
  description: string;
  media_type: string;
  mime_type: string;
  time_added: string;
}

export interface LoginResponse {
  token: string;
  user: {
    user_id: number;
    username: string;
    email: string;
  };
  message: string;
}