import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

const STATIC_ACTIONS = [
  "Drink a glass of water.",
  "Stretch your arms overhead.",
  "Put away exactly one item.",
  "Take three deep breaths.",
  "Open a window for fresh air.",
  "Write down one thought.",
  "Stand up and shake your hands.",
  "Check your posture.",
  "Look at something 20 feet away.",
  "Rub your hands together for warmth."
];

export default function ModeB({ onExit }) {
  const { prefs } = usePreferences();
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDeck([...STATIC_ACTIONS].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (deck.length > 0 && prefs.audio) {
      const utterance = new SpeechSynthesisUtterance(deck[index]);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
    return () => window.speechSynthesis.cancel();
  }, [index, deck, prefs.audio]);

  const handleSkip = () => {
    setIndex((prev) => (prev + 1) % deck.length);
  };

  const handleRemove = () => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
    if (index >= newDeck.length) {
      setIndex(0);
    }
  };

  if (deck.length === 0) {
    return (
      <Card>
        <p className="text-center mb-6">No more ideas.</p>
        <Button text="Back" onClick={onExit} />
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-xl text-center mb-8 font-medium text-stone-800">
        {deck[index]}
      </p>
      <div className="space-y-3">
        <Button text="I'll do this" onClick={onExit} />
        <Button variant="secondary" text="Skip" onClick={handleSkip} />
        <Button variant="secondary" text="Show less like this" onClick={handleRemove} />
      </div>
      <div className="mt-4 text-center">
        <button onClick={onExit} className="text-stone-400 text-sm">
          Back
        </button>
      </div>
    </Card>
  );
}