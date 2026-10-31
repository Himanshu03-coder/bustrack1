export type ThemeName = 'midnight' | 'obsidian' | 'emerald' | 'arctic';

export const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'midnight', label: 'Midnight Blue',  swatch: '#080C18' },
  { id: 'obsidian', label: 'Obsidian Black', swatch: '#090A0D' },
  { id: 'emerald',  label: 'Emerald Glass',  swatch: '#070C0C' },
  { id: 'arctic',   label: 'Arctic Silver',  swatch: '#E2E4E8' },
];

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
}
