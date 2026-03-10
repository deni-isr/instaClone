export interface VisualMedia {
  file_id?: number;
  media_id?: number;
  user_id: number | string;
  filename: string;
  title: string;
  description?: string;
  media_type?: string;
  filesize?: number;
  created_at?: string;
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