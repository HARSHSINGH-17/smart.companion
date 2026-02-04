import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

export default function Launch({ onNext, onDemo }) {
  const { prefs } = usePreferences();

  const copy = {
    quiet: "This app helps you start.",
    gentle: "We’ll take this one small step at a time.",
    calm: "We’ll take this one small step at a time.",
    direct: "Let's get this done.",
  };

  return (
    <Card>
      <h1 className="text-3xl font-bold text-center mb-2 text-stone-800">
        Smart Companion
      </h1>
      <p className="text-center text-sm text-stone-500 mb-6 italic">
        This app is for people who want to work — but can’t start.
      </p>
      <p className="text-center mb-8 text-stone-600">
        {copy[prefs.tone] || copy.calm}
      </p>
      <div className="space-y-4">
        <Button text="Start" onClick={onNext} />
        <button
          onClick={onDemo}
          className="w-full py-2 text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-stone-600 transition-colors"
        >
          Demo with example
        </button>
      </div>
    </Card>
  );
}
