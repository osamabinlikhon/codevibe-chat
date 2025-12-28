import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User preferences interface
export interface UserPreferences {
  // Theme
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  
  // Chat preferences
  defaultModel: string;
  autoSave: boolean;
  showLineNumbers: boolean;
  codeTheme: string;
  
  // UI preferences
  sidebarCollapsed: boolean;
  compactMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // AI preferences
  streamingEnabled: boolean;
  maxTokens: number;
  temperature: number;
  
  // Privacy
  analyticsEnabled: boolean;
  errorReporting: boolean;
}

// Preferences state interface
interface PreferencesState {
  preferences: UserPreferences;
  
  // Actions
  setTheme: (theme: UserPreferences['theme']) => void;
  setPrimaryColor: (color: string) => void;
  setDefaultModel: (model: string) => void;
  toggleAutoSave: () => void;
  toggleShowLineNumbers: () => void;
  setCodeTheme: (theme: string) => void;
  toggleSidebar: () => void;
  toggleCompactMode: () => void;
  setFontSize: (size: UserPreferences['fontSize']) => void;
  toggleStreaming: () => void;
  setMaxTokens: (tokens: number) => void;
  setTemperature: (temp: number) => void;
  toggleAnalytics: () => void;
  toggleErrorReporting: () => void;
  resetPreferences: () => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  primaryColor: '#52c41a',
  defaultModel: 'llama-3.3-70b-versatile',
  autoSave: true,
  showLineNumbers: true,
  codeTheme: 'github-dark',
  sidebarCollapsed: false,
  compactMode: false,
  fontSize: 'medium',
  streamingEnabled: true,
  maxTokens: 4096,
  temperature: 0.7,
  analyticsEnabled: true,
  errorReporting: false,
};

// Create preferences store with persistence
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // Initial state
      preferences: defaultPreferences,

      // Actions
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),

      setPrimaryColor: (primaryColor) =>
        set((state) => ({
          preferences: { ...state.preferences, primaryColor },
        })),

      setDefaultModel: (defaultModel) =>
        set((state) => ({
          preferences: { ...state.preferences, defaultModel },
        })),

      toggleAutoSave: () =>
        set((state) => ({
          preferences: { ...state.preferences, autoSave: !state.preferences.autoSave },
        })),

      toggleShowLineNumbers: () =>
        set((state) => ({
          preferences: { ...state.preferences, showLineNumbers: !state.preferences.showLineNumbers },
        })),

      setCodeTheme: (codeTheme) =>
        set((state) => ({
          preferences: { ...state.preferences, codeTheme },
        })),

      toggleSidebar: () =>
        set((state) => ({
          preferences: { ...state.preferences, sidebarCollapsed: !state.preferences.sidebarCollapsed },
        })),

      toggleCompactMode: () =>
        set((state) => ({
          preferences: { ...state.preferences, compactMode: !state.preferences.compactMode },
        })),

      setFontSize: (fontSize) =>
        set((state) => ({
          preferences: { ...state.preferences, fontSize },
        })),

      toggleStreaming: () =>
        set((state) => ({
          preferences: { ...state.preferences, streamingEnabled: !state.preferences.streamingEnabled },
        })),

      setMaxTokens: (maxTokens) =>
        set((state) => ({
          preferences: { ...state.preferences, maxTokens },
        })),

      setTemperature: (temperature) =>
        set((state) => ({
          preferences: { ...state.preferences, temperature },
        })),

      toggleAnalytics: () =>
        set((state) => ({
          preferences: { ...state.preferences, analyticsEnabled: !state.preferences.analyticsEnabled },
        })),

      toggleErrorReporting: () =>
        set((state) => ({
          preferences: { ...state.preferences, errorReporting: !state.preferences.errorReporting },
        })),

      resetPreferences: () =>
        set({ preferences: defaultPreferences }),

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
    }),
    {
      name: 'codevibe-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Export default preferences for reference
export { defaultPreferences };
