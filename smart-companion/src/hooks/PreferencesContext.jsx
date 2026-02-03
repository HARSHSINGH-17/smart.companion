import { createContext, useContext, useState } from "react";

const PreferencesContext = createContext();

const DEFAULT_PREFS = {
  fontSize: "normal", // small | normal | large
  fontFamily: "sans", // sans | serif | mono
  tone: "quiet",      // quiet | gentle
  audio: false,       // true | false
  textLength: "normal", // short | normal
  highContrast: false, // true | false
  supportNeeds: "",   // User-defined context
  timeAnchorDuration: 5, // minutes
};

export function PreferencesProvider({ children }) {
  const [prefs, setPrefsState] = useState(() => {
    const stored = localStorage.getItem("prefs");
    return stored ? JSON.parse(stored) : DEFAULT_PREFS;
  });

  const setPrefs = (updates) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("prefs", JSON.stringify(next));
      return next;
    });
  };

  return (
    <PreferencesContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return ctx;
}
