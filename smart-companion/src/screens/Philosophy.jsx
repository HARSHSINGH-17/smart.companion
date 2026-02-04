import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Philosophy({ onNext }) {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-xl md:text-2xl font-light text-center text-stone-600 leading-relaxed mb-2">
          This app is designed to reduce pressure,
        </p>
        <p className="text-xl md:text-2xl font-bold text-center text-stone-800 mb-8">
          not increase productivity.
        </p>
        <p className="text-xs text-stone-400 text-center italic mb-12 max-w-xs">
          “This app intentionally avoids metrics because metrics can worsen executive dysfunction.”
        </p>
        <Button text="Continue" onClick={onNext} />
      </div>
    </Card>
  );
}