import React, { useState } from "react";
import Button from "../components/Button";

export default function MicroAction({ step, onDone, onExit, onPanic }) {
  const [showWhy, setShowWhy] = useState(false);

  // Handle both string steps (legacy/cache) and object steps
  const action = typeof step === "string" ? step : step.action;
  const why = typeof step === "string" ? "It reduces friction to zero." : step.why;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6 text-center relative">
      {/* Panic Button */}
      <button
        onClick={onPanic}
        className="absolute top-6 right-6 text-stone-400 hover:text-red-400 transition-colors uppercase text-xs tracking-widest font-bold"
      >
        Panic Mode
      </button>

      {/* Main Action */}
      <h1 className="text-4xl md:text-6xl font-light text-stone-800 mb-8 leading-tight max-w-2xl">
        {action}
      </h1>

      {/* Why This Step */}
      <div className="mb-12 h-8">
        {!showWhy ? (
          <button
            onClick={() => setShowWhy(true)}
            className="text-stone-400 text-sm italic hover:text-stone-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <span className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-[10px] font-serif">i</span>
            Why this step?
          </button>
        ) : (
          <p className="text-stone-500 text-sm italic animate-pulse">
            {why}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs space-y-4">
        <Button text="Done" onClick={() => { setShowWhy(false); onDone(); }} />
        <button
          onClick={onExit}
          className="text-stone-400 text-sm hover:text-stone-600 transition-colors"
        >
          Stop
        </button>
      </div>
    </div>
  );
}