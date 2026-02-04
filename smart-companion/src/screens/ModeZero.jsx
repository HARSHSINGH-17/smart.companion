import React, { useEffect, useState } from "react";

export default function ModeZero({ onExit }) {
  const [opacity, setOpacity] = useState("opacity-0");

  useEffect(() => {
    // Trigger fade in animation on mount
    requestAnimationFrame(() => setOpacity("opacity-100"));
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-100 text-stone-600 transition-opacity duration-1000 ${opacity}`}>
      <p className="text-2xl font-light tracking-wide text-center px-6 leading-relaxed">
        Sit here for 10 seconds.
        <br />
        That’s all.
      </p>
      
      <button 
        onClick={onExit}
        className="absolute bottom-12 text-xs text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest"
      >
        I'm back
      </button>
    </div>
  );
}