import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { getDecision } from "../ai";
import { usePreferences } from "../hooks/PreferencesContext";

export default function DecisionMode({ onBack, onStart }) {
  const { prefs } = usePreferences();
  const [choiceA, setChoiceA] = useState("");
  const [choiceB, setChoiceB] = useState("");
  const [result, setResult] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleDecide = async () => {
    if (isThinking || !choiceA || !choiceB) return;

    setIsThinking(true);

    try {
      const decision = await getDecision(choiceA, choiceB);
      setResult(decision);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (result && prefs.audio) {
      const text = `${result.answer}. ${result.reason}`;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
    return () => window.speechSynthesis.cancel();
  }, [result, prefs.audio]);

  if (result) {
    return (
      <Card>
        <p className="text-center text-stone-500 mb-4">You should:</p>
        <p className="text-2xl font-bold text-center mb-6">{result.answer}</p>
        <p className="text-center text-stone-500 mb-8 italic">"{result.reason}"</p>
        
        <div className="space-y-3">
          <Button text="Let's do it" onClick={() => onStart(result.steps)} />
          <Button variant="secondary" text="Done" onClick={onBack} />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-center mb-6">What are you deciding between?</p>

      <div className="space-y-4 mb-8">
        <input
          className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800"
          placeholder="Option A"
          value={choiceA}
          onChange={(e) => setChoiceA(e.target.value)}
          disabled={isThinking}
        />
        <input
          className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800"
          placeholder="Option B"
          value={choiceB}
          onChange={(e) => setChoiceB(e.target.value)}
          disabled={isThinking}
        />
      </div>

      <Button
        text={isThinking ? "Thinking..." : "Decide for me"}
        onClick={handleDecide}
      />

      <div className="mt-3">
        <Button variant="secondary" text="Back" onClick={onBack} />
      </div>
    </Card>
  );
}