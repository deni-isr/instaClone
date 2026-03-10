import { create } from 'zustand';

interface User {
  user_id: number;
  username: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  /**
   * Uloskirjautumisfunktio: Tyhjentää globaalin tilan ja poistaa 
   * paikalliseen välimuistiin (localStorage) tallennetun valtuutustunnisteen.
   */
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useUserStore;