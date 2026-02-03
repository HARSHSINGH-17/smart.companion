import { useState } from "react";
import Launch from "./screens/Launch";
import Home from "./screens/Home";
import MicroStep from "./screens/MicroStep";
import { fakeSteps } from "./logic/fakeModeA";

export default function App() {
  const [screen, setScreen] = useState("launch");
  const [currentStep, setCurrentStep] = useState("");

  const handleStart = (mode) => {
    const step = fakeSteps[mode];
    if (step) {
      setCurrentStep(step);
      setScreen("step");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-800">
      <div className="w-full max-w-md">
        {screen === "launch" && <Launch onNext={() => setScreen("home")} />}
        {screen === "home" && <Home onStart={handleStart} />}
        {screen === "step" && (
          <MicroStep
            text={currentStep}
            onDone={() => setScreen("home")}
            onExit={() => setScreen("home")}
          />
        )}
      </div>
    </div>
  );
}