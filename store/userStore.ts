import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User, Language } from '../types';
import { authApi, loadToken } from '../lib/api';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  appLanguage: Language;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLanguage: (language: Language) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email?: string; password?: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  syncProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      appLanguage: 'en',
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          appLanguage: user.preferredLanguage || get().appLanguage,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      setLanguage: (language) => {
        set({ appLanguage: language });
        const user = get().user;
        if (user) {
          set({ user: { ...user, preferredLanguage: language } });
          authApi.updateProfile({ preferredLanguage: language }).catch(() => {});
        }
      },

      updateSettings: (settings) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, settings: { ...state.user.settings, ...settings } }
            : null,
        })),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(email, password);
          const user: User = {
            id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            preferredLanguage: data.preferredLanguage || 'en',
            conditions: data.conditions || [],
            createdAt: data.createdAt || new Date().toISOString(),
            settings: data.settings || {
              notifications: true,
              voiceEnabled: true,
              largeText: false,
              highContrast: false,
              reminderSound: 'default',
              reminderAdvanceMinutes: 15,
            },
          };
          set({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(data);
          const user: User = {
            id: res._id,
            name: res.name,
            email: res.email,
            phone: res.phone,
            preferredLanguage: res.preferredLanguage || 'en',
            conditions: res.conditions || [],
            createdAt: res.createdAt || new Date().toISOString(),
            settings: res.settings || {
              notifications: true,
              voiceEnabled: true,
              largeText: false,
              highContrast: false,
              reminderSound: 'default',
              reminderAdvanceMinutes: 15,
            },
          };
          set({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      logout: async () => {
        await authApi.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      loadStoredAuth: async () => {
        try {
          await loadToken();
          const data = await authApi.getMe();
          if (data) {
            const user: User = {
              id: data._id || data.id,
              name: data.name,
              email: data.email,
              phone: data.phone,
              preferredLanguage: data.preferredLanguage || 'en',
              conditions: data.conditions || [],
              createdAt: data.createdAt || new Date().toISOString(),
              settings: data.settings || get().user?.settings || {
                notifications: true, voiceEnabled: true, largeText: false,
                highContrast: false, reminderSound: 'default', reminderAdvanceMinutes: 15,
              },
            };
            set({ user, isAuthenticated: true });
          }
        } catch {
          await authApi.logout();
        }
      },

      syncProfile: async () => {
        try {
          const data = await authApi.getMe();
          if (data) {
            set((state) => ({
              user: state.user ? { ...state.user, ...data } : null,
            }));
          }
        } catch {}
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        appLanguage: state.appLanguage,
      }),
    }
  )
);
