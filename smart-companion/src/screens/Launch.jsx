import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

export default function Launch({ onNext }) {
  const { prefs } = usePreferences();

  const copy = {
    quiet: "This app helps you start.",
    gentle: "We’ll take this one small step at a time.",
  };

  return (
    <Card>
      <h1 className="text-3xl font-bold text-center mb-4 text-stone-800">
        Smart Companion
      </h1>
      <p className="text-center mb-8 text-stone-600">
        {copy[prefs.tone]}
      </p>
      <Button text="Start" onClick={onNext} />
    </Card>
  );
}
