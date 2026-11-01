export type ThemeName = 'light' | 'dark' | 'obsidian' | 'emerald';

export interface ThemeOption {
  id: ThemeName;
  label: string;
  description: string;
  swatch: string;
  isDark: boolean;
}

export const THEMES: ThemeOption[] = [
  { id: 'light',    label: 'Minimalist Light',  description: 'Clean pure white & slate', swatch: '#FFFFFF', isDark: false },
  { id: 'dark',     label: 'Midnight Slate',    description: 'Deep modern dark mode',    swatch: '#0F172A', isDark: true },
  { id: 'obsidian', label: 'Obsidian Black',    description: 'AMOLED pitch black',       swatch: '#000000', isDark: true },
  { id: 'emerald',  label: 'Nordic Emerald',    description: 'Forest teal & slate',      swatch: '#061A14', isDark: true },
];

export function getSavedTheme(): ThemeName {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('bt_theme') as ThemeName | null;
    if (saved && THEMES.some(t => t.id === saved)) return saved;
  } catch (e) {
    // fallback
  }
  return 'light';
}

export function applyTheme(theme: ThemeName) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
  try {
    localStorage.setItem('bt_theme', theme);
  } catch (e) {
    // ignore
  }
}

export function toggleLightDark(currentTheme: ThemeName): ThemeName {
  const nextTheme: ThemeName = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  return nextTheme;
}
