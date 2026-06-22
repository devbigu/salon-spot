/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

const THEME_STORAGE_KEY = "salon.theme.preference";

const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

const getDeviceSkin = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const getSavedPreference = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : "system";
  } catch {
    return "system";
  }
};

const getInitialTheme = () => {
  const preference = getSavedPreference();
  return {
    main: "default",
    sidebar: "dark",
    sidebarCompact: false,
    sidebarVisibility: false,
    sidebarMobile: window.innerWidth < 1200,
    header: "white",
    preference,
    skin: preference === "system" ? getDeviceSkin() : preference,
  };
};

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

const ThemeProvider = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  const setSkinPreference = (preference) => {
    const validPreference =
      preference === "dark" || preference === "light" ? preference : "system";

    try {
      if (validPreference === "system") {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, validPreference);
      }
    } catch {
      // Theme still works for this session when browser storage is unavailable.
    }

    setTheme((current) => ({
      ...current,
      preference: validPreference,
      skin:
        validPreference === "system" ? getDeviceSkin() : validPreference,
    }));
  };

  const themeUpdate = useMemo(
    () => ({
      uistyle: (value) =>
        setTheme((current) => ({ ...current, main: value })),
      sidebar: (value) =>
        setTheme((current) => ({ ...current, sidebar: value })),
      sidebarCompact: () =>
        setTheme((current) => ({
          ...current,
          sidebarCompact: !current.sidebarCompact,
        })),
      sidebarVisibility: () =>
        setTheme((current) => ({
          ...current,
          sidebarVisibility: !current.sidebarVisibility,
        })),
      sidebarHide: () =>
        setTheme((current) => ({ ...current, sidebarVisibility: false })),
      header: (value) =>
        setTheme((current) => ({ ...current, header: value })),
      skin: setSkinPreference,
      useDeviceSkin: () => setSkinPreference("system"),
      reset: () => {
        setSkinPreference("system");
        setTheme((current) => ({
          ...current,
          main: "default",
          sidebar: "dark",
          header: "white",
          sidebarCompact: false,
          sidebarVisibility: false,
        }));
      },
    }),
    []
  );

  useEffect(() => {
    const body = document.body;
    body.className =
      "nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme";
  }, []);

  useEffect(() => {
    const body = document.body;

    body.classList.remove("ui-default", "ui-clean", "ui-shady", "ui-softy");
    body.classList.add(`ui-${theme.main}`);
    body.classList.toggle("dark-mode", theme.skin === "dark");
    body.classList.toggle("nav-shown", theme.sidebarVisibility);
    document.documentElement.style.colorScheme = theme.skin;
  }, [theme.main, theme.sidebarVisibility, theme.skin]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleDeviceThemeChange = (event) => {
      setTheme((current) =>
        current.preference === "system"
          ? { ...current, skin: event.matches ? "dark" : "light" }
          : current
      );
    };

    media.addEventListener?.("change", handleDeviceThemeChange);
    return () => media.removeEventListener?.("change", handleDeviceThemeChange);
  }, []);

  useEffect(() => {
    const handleMobileSidebar = () => {
      const mobile = window.innerWidth < 1200;
      setTheme((current) => ({
        ...current,
        sidebarMobile: mobile,
        ...(!mobile ? { sidebarVisibility: false } : {}),
      }));
    };

    window.addEventListener("resize", handleMobileSidebar);
    return () => window.removeEventListener("resize", handleMobileSidebar);
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={themeUpdate}>
        <Outlet />
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
