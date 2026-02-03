import Card from "../components/Card";
import Button from "../components/Button";

export default function SetSpace({ onNext }) {
  return (
    <Card>
      <p className="mb-4 text-center">
        Set your space.
      </p>
      <Button text="Continue" onClick={onNext} />
      <div className="mt-3">
        <Button
          text="Skip"
          variant="secondary"
          onClick={onNext}
        />
      </div>
    </Card>
  );
}
