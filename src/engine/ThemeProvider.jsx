import { useEffect, useMemo } from "react";

import {
  ThemeProvider as ThemeContextProvider,
} from "../contexts/ThemeContext";

import { applyTheme } from "./applyTheme";
import { resolveTheme } from "./resolveTheme";

export default function ThemeProvider({
  theme,
  children,
}) {
  const resolvedTheme = useMemo(() => {
    return resolveTheme(theme || {});
  }, [theme]);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContextProvider theme={resolvedTheme}>
      {children}
    </ThemeContextProvider>
  );
}