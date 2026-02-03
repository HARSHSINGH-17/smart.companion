import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

export default function Breathing({ onExit }) {
  const { prefs, setPrefs } = usePreferences();
  const [phase, setPhase] = useState("in"); // in | hold | out

  const playChime = (freq) => {
    if (!prefs.audio) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

    osc.start(now);
    osc.stop(now + 3.5);
  };

  useEffect(() => {
    const times = { in: 4000, hold: 4000, out: 4000 };
    let timer;

    const step = (current) => {
      if (current === "in") {
        setPhase("hold");
        timer = setTimeout(() => step("hold"), times.hold);
      } else if (current === "hold") {
        setPhase("out");
        timer = setTimeout(() => step("out"), times.out);
      } else {
        setPhase("in");
        timer = setTimeout(() => step("in"), times.in);
      }
    };

    // Start loop
    timer = setTimeout(() => step("in"), times.in);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "in") playChime(329.63); // E4 (Inhale)
    if (phase === "out") playChime(261.63); // C4 (Exhale)
  }, [phase, prefs.audio]);

  const getStyles = () => {
    if (phase === "in") return "scale-150 bg-blue-300";
    if (phase === "hold") return "scale-150 bg-blue-300";
    return "scale-100 bg-stone-300";
  };

  return (
    <Card>
      <div className="flex justify-end mb-4">
        <button onClick={() => setPrefs({ audio: !prefs.audio })} className="text-sm text-stone-400 hover:text-stone-600">
          {prefs.audio ? "Sound On 🔊" : "Sound Off 🔇"}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center py-12">
        <div className={`w-32 h-32 rounded-full transition-all duration-[4000ms] ease-in-out ${getStyles()}`} />
        <p className="mt-12 text-3xl font-bold text-stone-600">
          {phase === "in" ? "Breathe In" : phase === "hold" ? "Hold" : "Breathe Out"}
        </p>
      </div>
      <Button text="I'm feeling better" onClick={onExit} />
    </Card>
  );
}