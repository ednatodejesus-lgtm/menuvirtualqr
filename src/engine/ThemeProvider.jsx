import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { resolveTheme, resolveColors, resolveFonts } from './index';

const ThemeContext = createContext(null);

export function ThemeProvider({ theme: restaurantTheme, children }) {
  // Resolver tema completo
  const theme = useMemo(() => resolveTheme(restaurantTheme), [restaurantTheme]);
  const colors = useMemo(() => resolveColors(theme), [theme]);
  const fonts = useMemo(() => resolveFonts(theme), [theme]);
  
  useEffect(() => {
    // Aplicar CSS variables
    const root = document.documentElement;
    
    // Cores
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Data attributes para estilos
    root.setAttribute('data-theme-variant', theme?.layout?.hero?.variant || 'centered');
    root.setAttribute('data-menu-variant', theme?.layout?.menu?.variant || 'grid');
    root.setAttribute('data-footer-variant', theme?.layout?.footer?.variant || 'minimal');
    root.setAttribute('data-categories-variant', theme?.layout?.categories?.variant || 'tabs');
    root.setAttribute('data-density', theme?.layout?.density || 'comfortable');
    
    // Limpeza
    return () => {
      Object.keys(colors).forEach((key) => {
        root.style.removeProperty(key);
      });
      root.removeAttribute('data-theme-variant');
      root.removeAttribute('data-menu-variant');
      root.removeAttribute('data-footer-variant');
      root.removeAttribute('data-categories-variant');
      root.removeAttribute('data-density');
    };
  }, [colors, theme]);
  
  const value = useMemo(() => ({
    theme,
    colors,
    fonts
  }), [theme, colors, fonts]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error(
      "useTheme must be used inside a ThemeProvider"
    );
  }
  
  return context;
}

export default ThemeContext;