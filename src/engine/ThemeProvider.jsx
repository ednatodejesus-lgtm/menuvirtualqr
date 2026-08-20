import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { resolveTheme, resolveColors, resolveFonts } from './index';

const ThemeContext = createContext(null);

export function ThemeProvider({ theme: restaurantTheme, children }) {
  const theme = useMemo(() => resolveTheme(restaurantTheme), [restaurantTheme]);
  const colors = useMemo(() => resolveColors(theme), [theme]);
  const fonts = useMemo(() => resolveFonts(theme), [theme]);
  
  useEffect(() => {
    const root = document.documentElement;
    
    // 🔥 APLICAR TODAS AS CORES COMO CSS VARIABLES
    if (colors) {
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
    
    // 🔥 APLICAR FONTES
    if (fonts) {
      // Carregar fontes do Google
      if (fonts.fontUrl) {
        let link = document.querySelector('#google-fonts-link');
        if (!link) {
          link = document.createElement('link');
          link.id = 'google-fonts-link';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
        link.href = fonts.fontUrl;
      }

      // Aplicar fontes como CSS variables
      root.style.setProperty('--font-heading', fonts.heading || 'Playfair Display');
      root.style.setProperty('--font-body', fonts.body || 'Inter');
      root.style.setProperty('--font-accent', fonts.accent || 'Lato');
      root.style.setProperty('--heading-weight', fonts.headingWeight || '700');
      root.style.setProperty('--body-weight', fonts.bodyWeight || '400');
    }
    
    // Data attributes para estilos
    root.setAttribute('data-theme-variant', theme?.layout?.hero?.variant || 'centered');
    root.setAttribute('data-menu-variant', theme?.layout?.menu?.variant || 'grid');
    root.setAttribute('data-footer-variant', theme?.layout?.footer?.variant || 'minimal');
    root.setAttribute('data-categories-variant', theme?.layout?.categories?.variant || 'tabs');
    root.setAttribute('data-density', theme?.layout?.density || 'comfortable');
    
    // 🔥 LOG PARA DEBUG
    console.log('🔍 ThemeProvider aplicado:');
    console.log('  Cores:', colors);
    console.log('  Fontes:', fonts);
    
    return () => {
      // Limpar CSS variables
      if (colors) {
        Object.keys(colors).forEach((key) => {
          root.style.removeProperty(key);
        });
      }
      // Remover fontes
      root.style.removeProperty('--font-heading');
      root.style.removeProperty('--font-body');
      root.style.removeProperty('--font-accent');
      root.style.removeProperty('--heading-weight');
      root.style.removeProperty('--body-weight');
      // Remover data attributes
      root.removeAttribute('data-theme-variant');
      root.removeAttribute('data-menu-variant');
      root.removeAttribute('data-footer-variant');
      root.removeAttribute('data-categories-variant');
      root.removeAttribute('data-density');
    };
  }, [colors, fonts, theme]);
  
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
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}

export default ThemeContext;