import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Settings({ onBack }) {
  const handleClearCache = () => {
    const keys = Object.keys(localStorage);
    let count = 0;
    keys.forEach((key) => {
      if (key.startsWith("smc_cache_")) {
        localStorage.removeItem(key);
        count++;
      }
    });
    alert(`Cleared ${count} cached responses. The AI will now generate fresh steps.`);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-stone-600 uppercase tracking-widest">
          Settings
        </h2>
        <button
          onClick={onBack}
          className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="pt-2">
          <h3 className="text-sm font-bold text-stone-500 mb-2">Troubleshooting</h3>
          <p className="text-xs text-stone-400 mb-4 leading-relaxed">
            If the AI is giving repetitive or unhelpful responses, clearing the cache will force it to think again.
          </p>
          <Button text="Clear AI Cache" onClick={handleClearCache} variant="secondary" />
        </div>
      </div>
    </Card>
  );
}