const STORAGE_KEY = 'anatome.theme';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

const listeners = new Set();

export const readTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  } catch (error) {
    return THEME_LIGHT;
  }
};

export const applyTheme = theme => {
  const next = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch (error) {
    // A troca ainda vale nesta página.
  }
  listeners.forEach(listener => listener(next));
  return next;
};

export const toggleTheme = () => (
  applyTheme(readTheme() === THEME_DARK ? THEME_LIGHT : THEME_DARK)
);

export const subscribeTheme = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
