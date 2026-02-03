import { useEffect, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

export default function MicroAction({ step, onDone, onExit, onPanic }) {
  const { prefs } = usePreferences();
  const [timerActive, setTimerActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefs.audio) {
      const utterance = new SpeechSynthesisUtterance(step);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
    return () => window.speechSynthesis.cancel();
  }, [step, prefs.audio]);

  useEffect(() => {
    let interval;
    if (timerActive && progress < 100) {
      const durationSeconds = (prefs.timeAnchorDuration || 5) * 60;
      const incrementPerSecond = 100 / durationSeconds;

      interval = setInterval(() => {
        setProgress((p) => Math.min(p + incrementPerSecond, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, progress, prefs.timeAnchorDuration]);

  return (
    <Card>
      <div className="flex justify-end mb-2">
        <button onClick={onPanic} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest">
          Panic Mode
        </button>
      </div>

      <p className="text-lg mb-6 text-center">
        {step}
      </p>

      {/* Time Blindness Anchor */}
      <div className="mb-6">
        {!timerActive ? (
          <button
            onClick={() => setTimerActive(true)}
            className="text-xs text-stone-400 hover:text-stone-600 underline w-full text-center"
          >
            Need a time anchor? ({prefs.timeAnchorDuration || 5}m)
          </button>
        ) : (
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-stone-300 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <Button text="Done" onClick={onDone} />
      <div className="mt-3">
        <Button
          text="That's enough"
          variant="secondary"
          onClick={onExit}
        />
      </div>
    </Card>
  );
}
