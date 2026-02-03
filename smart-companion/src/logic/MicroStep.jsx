import Card from "../components/Card";
import Button from "../components/Button";

export default function MicroStep({ text, onDone, onExit }) {
  return (
    <Card>
      <p className="text-xl text-center mb-8 font-medium text-stone-800">
        {text}
      </p>
      <div className="space-y-3">
        <Button text="Done" onClick={onDone} />
        <Button variant="secondary" text="That's enough" onClick={onExit} />
      </div>
    </Card>
  );
}