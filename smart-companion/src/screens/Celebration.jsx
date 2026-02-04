import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Celebration({ onHome }) {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-6 animate-bounce">
          🎉
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-4">
          Task Complete!
        </h1>
        <p className="text-stone-600 mb-8 max-w-xs mx-auto">
          You took action. That’s a win.
        </p>
        <Button text="Back to Home" onClick={onHome} />
      </div>
    </Card>
  );
}