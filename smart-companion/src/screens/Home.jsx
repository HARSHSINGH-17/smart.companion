import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

export default function Home({ onStart }) {
  const { prefs } = usePreferences();
  const [task, setTask] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(!!(import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem("openai_api_key")));

  const handleSaveKey = () => {
    if (tempKey.trim().startsWith("sk-")) {
      localStorage.setItem("openai_api_key", tempKey.trim());
      setHasApiKey(true);
    }
  };

  const playBeep = (freq) => {
    if (!prefs.audio) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onstart = () => {
      setIsListening(true);
      playBeep(600);
    };
    recognition.onend = () => {
      setIsListening(false);
      playBeep(400);
    };
    recognition.onresult = (event) => {
      setTask(event.results[0][0].transcript);
    };
  };

  return (
    <Card>
      <h1 className="text-xs font-bold text-center mb-4 text-stone-400 uppercase tracking-widest">
        Smart Companion
      </h1>
      {!hasApiKey && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6 text-center">
          <p className="text-xs text-red-400 mb-2 font-bold">Offline Mode (No AI Key Detected)</p>
          <input 
            type="password" 
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Enter OpenAI API Key (sk-...)"
            className="w-full p-2 text-sm border border-red-200 rounded mb-2 focus:outline-none focus:border-red-400"
          />
          <Button text="Save Key" onClick={handleSaveKey} variant="danger" />
          <p className="text-[10px] text-stone-400 mt-2">Or create a .env file with VITE_OPENAI_API_KEY</p>
        </div>
      )}
      <p className="mb-6 text-center">
        What do you need right now?
      </p>

      <div className="mb-6 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Or type a specific task..."
            className="w-full p-4 pr-12 rounded-2xl bg-stone-100 border-none focus:ring-2 focus:ring-stone-800 outline-none placeholder-stone-400"
            onKeyDown={(e) => e.key === "Enter" && task.trim() && onStart(task.trim())}
          />
          <button
            onClick={handleVoiceInput}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
              isListening ? "bg-red-100 text-red-600 animate-pulse" : "text-stone-400 hover:text-stone-600"
            }`}
            title="Voice Input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
        {task && <Button text="Break it down" onClick={() => onStart(task.trim())} />}
      </div>

      <div className="space-y-3">
        <Button
          text="I can't start"
          onClick={() => onStart("cant_start")}
        />
        <Button
          text="I feel scattered"
          onClick={() => onStart("scattered")}
        />
        <Button
          text="I'm overwhelmed"
          onClick={() => onStart("overwhelmed")}
        />
        <Button
          text="I'm tired"
          onClick={() => onStart("tired")}
        />
        <Button
          text="I need help deciding"
          onClick={() => onStart("deciding")}
        />
        <Button
          text="Panic Mode"
          variant="danger"
          onClick={() => onStart("panic")}
        />
        <Button
          text="Explore ideas"
          variant="secondary"
          onClick={() => onStart("modeB")}
        />
        <Button
          text="Settings"
          variant="secondary"
          onClick={() => onStart("settings")}
        />
      </div>
    </Card>
  );
}
