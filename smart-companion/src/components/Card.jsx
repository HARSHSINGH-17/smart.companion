import { usePreferences } from "../hooks/PreferencesContext";

export default function Card({ children }) {
  const { prefs } = usePreferences();

  const fontSizes = {
    small: "text-sm",
    normal: "text-base",
    large: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const fontFamilies = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  };

  const containerClasses = prefs.highContrast
    ? "bg-black"
    : "bg-stone-200";

  const cardClasses = prefs.highContrast
    ? "bg-white border-4 border-black text-black"
    : "bg-stone-50 text-stone-800 shadow-xl";

  return (
    <div className={`h-screen w-screen flex items-center justify-center transition-colors duration-500 ${containerClasses}`}>
      <div
        className={`w-full max-w-md rounded-3xl p-8 ${cardClasses} ${fontSizes[prefs.fontSize]} ${fontFamilies[prefs.fontFamily || "sans"]} transition-all duration-300`}
      >
        {children}
      </div>
    </div>
  );
}
