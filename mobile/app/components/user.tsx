import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  roleId: number;
}

interface UserState {
  isLoggedIn: boolean;
  userRole: 'admin' | 'client' | null;
  token: string | null;
  userInfo: UserInfo | null;
  
  // Actions
  login: (role: 'admin' | 'client') => void;
  logout: () => void;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  clearToken: () => void;
  
  // Helper functions
  getAuthHeaders: () => Record<string, string | undefined>;
  isTokenValid: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userRole: null,
      token: null,
      userInfo: null,

      login: (role: 'admin' | 'client') => 
        set({ 
          isLoggedIn: true, 
          userRole: role 
        }),

      logout: () => 
        set({ 
          isLoggedIn: false, 
          userRole: null, 
          token: null, 
          userInfo: null 
        }),

      setToken: (token: string) => 
        set({ token }),

      setUserInfo: (userInfo: UserInfo) => 
        set({ userInfo }),

      clearToken: () => 
        set({ token: null }),

      getAuthHeaders: () => {
        const { token } = get();
        return token 
          ? {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          : {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            };
      },

      // Token geçerliliği kontrolü (basit)
      isTokenValid: () => {
        const { token } = get();
        return token !== null && token.length > 0;
      },
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userRole: state.userRole,
        token: state.token,
        userInfo: state.userInfo,
      }),
    }
  )
);