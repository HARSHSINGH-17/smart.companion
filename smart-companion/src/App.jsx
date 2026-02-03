import { useState } from "react";
import Launch from "./screens/Launch";
import SetSpace from "./screens/SetSpace";
import Home from "./screens/Home";
import MicroAction from "./screens/MicroAction";
import Settings from "./screens/Settings";
import DecisionMode from "./logic/DecisionMode";
import ModeB from "./logic/ModeB";
import Breathing from "./screens/Breathing";
import Card from "./components/Card";
import { usePreferences } from "./hooks/PreferencesContext";
import { getMicroSteps } from "./ai";


export default function App() {
  const [screen, setScreen] = useState("launch");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const { prefs } = usePreferences();

  if (screen === "launch")
    return <Launch onNext={() => setScreen("set")} />;

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
            setSteps(result);
            setStepIndex(0);
            setScreen("micro");
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

  if (screen === "panic")
    return <Breathing onExit={() => setScreen("home")} />;

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
            setScreen("home");
          }
        }}
        onExit={() => setScreen("home")}
        onPanic={() => setScreen("panic")}
      />
    );
}
