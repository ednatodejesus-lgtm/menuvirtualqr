import { createContext, useContext, useMemo } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ theme, children }) {
  const value = useMemo(
    () => ({
      theme: theme || {},
    }),
    [theme]
  );

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