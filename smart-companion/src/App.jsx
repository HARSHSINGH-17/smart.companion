import { useState, useEffect } from "react";
import Launch from "./screens/Launch";
import SetSpace from "./screens/SetSpace";
import Home from "./screens/Home";
import Philosophy from "./screens/Philosophy";
import MicroAction from "./screens/MicroAction";
import Celebration from "./screens/Celebration";
import Settings from "./screens/Settings";
import DecisionMode from "./logic/DecisionMode";
import ModeB from "./logic/ModeB";
import ModeZero from "./screens/ModeZero";
import Breathing from "./screens/Breathing";
import Card from "./components/Card";
import { usePreferences } from "./hooks/PreferencesContext";
import { getMicroSteps } from "./ai";


export default function App() {
  const [screen, setScreen] = useState("launch");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const { prefs } = usePreferences();

  useEffect(() => {
    // Load Fonts
    const linkLexend = document.createElement("link");
    linkLexend.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&display=swap";
    linkLexend.rel = "stylesheet";
    document.head.appendChild(linkLexend);

    const linkDyslexic = document.createElement("link");
    linkDyslexic.href = "https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/open-dyslexic.min.css";
    linkDyslexic.rel = "stylesheet";
    document.head.appendChild(linkDyslexic);

    return () => {
      document.head.removeChild(linkLexend);
      document.head.removeChild(linkDyslexic);
    };
  }, []);

  useEffect(() => {
    const fontMap = {
      lexend: '"Lexend", sans-serif',
      dyslexic: '"OpenDyslexic", sans-serif',
      default: 'ui-sans-serif, system-ui, sans-serif',
    };
    document.documentElement.style.fontFamily = fontMap[prefs.fontFamily] || fontMap.default;
    document.body.style.fontFamily = fontMap[prefs.fontFamily] || fontMap.default;

    const sizeMap = {
      small: "14px",
      normal: "16px",
      large: "18px",
      xl: "20px",
      "2xl": "24px",
    };
    document.documentElement.style.fontSize = sizeMap[prefs.fontSize] || "16px";
  }, [prefs.fontFamily, prefs.fontSize]);

  if (screen === "launch")
    return (
      <Launch 
        onNext={() => setScreen("philosophy")} 
        onDemo={() => {
          setSteps([{ action: "Open your notebook.", why: "Reduces friction to zero.", load: "Very Light" }]);
          setStepIndex(0);
          setScreen("micro");
        }}
      />
    );

  if (screen === "philosophy")
    return <Philosophy onNext={() => setScreen("set")} />;

  if (screen === "set")
    return <SetSpace onNext={() => setScreen("home")} />;

  if (screen === "loading")
    return (
      <Card>
        <p className="text-center text-lg animate-pulse">Thinking...</p>
      </Card>
    );

  if (screen === "home")
    return (
      <Home
        onStart={async (key) => {
          if (key === "deciding") {
            setScreen("decision");
          } else if (key === "modeB") {
            setScreen("modeB");
          } else if (key === "panic") {
            setScreen("panic");
          } else if (key === "settings") {
            setScreen("settings");
          } else if (key === "modeZero") {
            setScreen("modeZero");
          } else {
            setScreen("loading");
            const map = {
              cant_start: "I can't start",
              scattered: "I feel scattered",
              overwhelmed: "I'm overwhelmed",
              tired: "I'm tired"
            };
            const text = map[key] || key;
            const result = await getMicroSteps(text, prefs);
            if (Array.isArray(result) && result.length > 0) {
              setSteps(result);
              setStepIndex(0);
              setScreen("micro");
            } else {
              setScreen("home");
            }
          }
        }}
      />
    );

  if (screen === "decision")
    return (
      <DecisionMode 
        onBack={() => setScreen("home")} 
        onStart={(decisionSteps) => {
          setSteps(decisionSteps);
          setStepIndex(0);
          setScreen("micro");
        }}
      />
    );

  if (screen === "modeB")
    return <ModeB onExit={() => setScreen("home")} />;

  if (screen === "modeZero")
    return <ModeZero onExit={() => setScreen("home")} />;

  if (screen === "panic")
    return <Breathing onExit={() => setScreen("home")} />;

  if (screen === "celebration")
    return <Celebration onHome={() => setScreen("home")} />;

  if (screen === "settings")
    return <Settings onBack={() => setScreen("home")} />;

  if (screen === "micro")
    return (
      <MicroAction
        step={steps[stepIndex]}
        onDone={() => {
          if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
          } else {
            setScreen("celebration");
          }
        }}
        onExit={() => setScreen("home")}
        onPanic={() => setScreen("panic")}
      />
    );
}
