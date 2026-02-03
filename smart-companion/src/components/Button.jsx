import { usePreferences } from "../hooks/PreferencesContext";

export default function Button({ text, onClick, variant = "primary" }) {
  const { prefs } = usePreferences();

  const base =
    "w-full py-4 rounded-2xl text-base font-medium focus:outline-none transition-all duration-200 active:scale-[0.98]";

  const styles = {
    primary: prefs.highContrast
      ? "bg-black text-white border-2 border-black hover:bg-stone-900"
      : "bg-stone-800 text-stone-50 hover:bg-stone-900 shadow-md hover:shadow-lg",
    secondary: prefs.highContrast
      ? "bg-white text-black border-2 border-black hover:bg-stone-100"
      : "bg-stone-200 text-stone-700 hover:bg-stone-300",
    danger: prefs.highContrast
      ? "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
      : "bg-red-100 text-red-700 hover:bg-red-200",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
    >
      {text}
    </button>
  );
}
