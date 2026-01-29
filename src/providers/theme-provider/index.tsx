import { Theme as RadixTheme } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

import { APP_ROUTES } from "@/constants/routes";
import localStorageService from "@/utils/localStorage";

import { ThemeProviderContext } from "./context";
import type { Theme, ThemeProviderProps } from "./types";

const ThemeProvider = ({ children, defaultTheme = "light", ...props }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorageService.getItem("ui-theme") as Theme) || defaultTheme);

  const { pathname } = useLocation();
  const isSimpleSwap = useMemo(() => pathname.includes(APP_ROUTES.SIMPLE_SWAP.SWAP), [pathname]);
  const isOneClickSwap = useMemo(
    () => pathname === APP_ROUTES.ONE_CLICK_SWAP || pathname.startsWith("/swap/"),
    [pathname],
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorageService.setItem("ui-theme", theme);
        setTheme(theme);
      },
    }),
    [theme],
  );

  const radixAppearance = isOneClickSwap ? "dark" : theme === "dark" ? "dark" : "light";

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <RadixTheme accentColor={isSimpleSwap ? "ruby" : "gray"} appearance={radixAppearance} hasBackground={false}>
        {children}
      </RadixTheme>
    </ThemeProviderContext.Provider>
  );
};

export default ThemeProvider;
