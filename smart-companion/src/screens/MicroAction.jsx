import { useEffect, useState, useRef } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

const AFFIRMATIONS = [
  "That effort counts.",
  "Starting is enough for now.",
  "You didn’t fail. You paused.",
  "Showing up matters.",
  "This was a valid attempt."
];

export default function MicroAction({ step, onDone, onExit, onPanic }) {
  const { prefs } = usePreferences();
  const [timerActive, setTimerActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFallback, setIsFallback] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [showPaceCheck, setShowPaceCheck] = useState(false);
  const [paceCheckPhase, setPaceCheckPhase] = useState("prompt");
  const recentDurations = useRef([]);
  const [affirmation, setAffirmation] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  const [anchorStartTime, setAnchorStartTime] = useState(null);
  const [prevStep, setPrevStep] = useState(step);

  const isStepChanged = step !== prevStep;

  if (isStepChanged) {
    setPrevStep(step);
    setTimerActive(false);
    setProgress(0);
    setIsFallback(false);
    setShowReflection(false);
    setShowPaceCheck(false);
    setAffirmation(null);
    setShowWhy(false);
    setAnchorStartTime(null);
    setStartTime(Date.now());
  }

  useEffect(() => {
    if (affirmation) {
      const timer = setTimeout(() => {
        affirmation.callback();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [affirmation]);

  const triggerAffirmation = (callback) => {
    const message = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    setAffirmation({ message, callback });
  };

  const handleDone = () => {
    const duration = Date.now() - startTime;

    // Gentle Pace Check (Rapid Skipping)
    recentDurations.current.push(duration);
    if (recentDurations.current.length > 5) recentDurations.current.shift();

    const recent = recentDurations.current;
    if (recent.length >= 2 && recent.slice(-2).every(d => d < 2000)) {
      setShowPaceCheck(true);
      setPaceCheckPhase("prompt");
      recentDurations.current = [];
      return;
    }

    if (duration < 800) {
      setShowReflection(true);
    } else {
      triggerAffirmation(onDone);
    }
  };

  const safeStep = step || { action: "Loading...", why: "", load: "Light" };

  const actionText = isFallback 
    ? "That’s okay. Try just looking at the task." 
    : (typeof safeStep === "string" ? safeStep : safeStep.action) || "";

  const loadLabel = isFallback 
    ? "Very Light" 
    : (typeof safeStep === "string" ? "Light" : (safeStep.load || "Light"));
  
  const whyText = typeof safeStep === "string" ? "It reduces friction to zero." : safeStep.why;

  useEffect(() => {
    if (prefs.audio && !affirmation && !showReflection && !showPaceCheck && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(actionText);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Speech error:", e);
      }
    }
    return () => window.speechSynthesis.cancel();
  }, [actionText, prefs.audio, affirmation, showReflection, showPaceCheck]);

  useEffect(() => {
    let interval;
    if (timerActive && anchorStartTime) {
      const durationMs = (prefs.timeAnchorDuration || 5) * 60 * 1000;

      interval = setInterval(() => {
        const elapsed = Date.now() - anchorStartTime;
        const p = Math.min((elapsed / durationMs) * 100, 100);
        setProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 33);
    }
    return () => clearInterval(interval);
  }, [timerActive, anchorStartTime, prefs.timeAnchorDuration]);

  if (showReflection && !isStepChanged) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-xl font-light text-stone-600 text-center mb-8">
            You didn’t fail. You paused. That’s allowed.
          </p>
          <Button text="Home" onClick={onExit} />
        </div>
      </Card>
    );
  }

  if (showPaceCheck && !isStepChanged) {
    if (paceCheckPhase === "pause") {
      return (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-2xl font-light text-stone-600 mb-12">
              Just breathe. Nothing else.
            </p>
            <Button text="Continue" onClick={() => { setShowPaceCheck(false); onDone(); }} />
          </div>
        </Card>
      );
    }

    return (
      <Card>
        <div className="py-4">
          <p className="text-lg text-stone-600 mb-8 text-center leading-relaxed">
            It looks like this might be moving a little fast.
            <br />
            You don’t have to do anything perfectly.
            <br />
            Would you like to pause for a moment, or keep going?
          </p>
          <div className="space-y-3">
            <Button 
              text="Pause for a moment" 
              onClick={() => setPaceCheckPhase("pause")} 
              variant="secondary" 
            />
            <Button text="Keep going" onClick={() => { setShowPaceCheck(false); onDone(); }} />
            <Button text="That’s enough for now" onClick={onExit} variant="secondary" />
          </div>
        </div>
      </Card>
    );
  }

  if (affirmation && !isStepChanged) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-xl font-light text-stone-600 text-center animate-pulse">
            {affirmation.message}
          </p>
        </div>
      </Card>
    );
  }

  const isLowIntensity = prefs.lowIntensity;

  return (
    <Card>
      <div className={`flex justify-end ${isLowIntensity ? "mb-4" : "mb-2"}`}>
        <button onClick={onPanic} className={`${isLowIntensity ? "text-sm p-3" : "text-xs"} font-bold text-red-400 hover:text-red-600 uppercase tracking-widest`}>
          Panic Mode
        </button>
      </div>

      {/* Cognitive Load Indicator */}
      <div className={`flex justify-center ${isLowIntensity ? "mb-6" : "mb-4"}`}>
        <span className="px-3 py-1 bg-stone-100 text-stone-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
          {loadLabel}
        </span>
      </div>

      <p className={`text-lg text-center ${isLowIntensity ? "mb-4 text-stone-500" : "mb-4 text-stone-800"}`}>
        {actionText}
      </p>

      {/* Why This Step */}
      <div className="mb-8 h-6 flex justify-center">
        {!isFallback && (
          !showWhy ? (
            <button
              onClick={() => setShowWhy(true)}
              className="text-stone-400 text-xs italic hover:text-stone-600 transition-colors flex items-center gap-1"
            >
              <span className="w-3 h-3 rounded-full border border-stone-300 flex items-center justify-center text-[8px] font-serif">i</span>
              Why this step?
            </button>
          ) : (
            <p className="text-stone-500 text-xs italic animate-pulse">
              {whyText}
            </p>
          )
        )}
      </div>

      {/* Time Blindness Anchor */}
      <div className={isLowIntensity ? "mb-10" : "mb-6"}>
        {!timerActive ? (
          <button
            onClick={() => {
              setTimerActive(true);
              setAnchorStartTime(Date.now());
            }}
            className={`${isLowIntensity ? "text-sm p-2" : "text-xs"} text-stone-400 hover:text-stone-600 underline w-full text-center`}
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

      <Button text="Done" onClick={handleDone} />
      
      {!isFallback && (
        <button 
          onClick={() => setIsFallback(true)}
          className={`${isLowIntensity ? "mt-6 text-sm p-4" : "mt-4 text-xs"} w-full text-center text-stone-400 hover:text-stone-600 underline transition-colors`}
        >
          I can't do this
        </button>
      )}

      <div className={isLowIntensity ? "mt-6" : "mt-3"}>
        <Button
          text="That's enough"
          variant="secondary"
          onClick={() => triggerAffirmation(onExit)}
        />
      </div>
    </Card>
  );
}
