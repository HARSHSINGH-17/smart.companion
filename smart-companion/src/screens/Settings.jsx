import Card from "../components/Card";
import Button from "../components/Button";
import { usePreferences } from "../hooks/PreferencesContext";

export default function Settings({ onBack }) {
  const { prefs, setPrefs } = usePreferences();

  const cycleFont = () => {
    const sizes = ["normal", "large", "xl", "2xl", "small"];
    const next = sizes[(sizes.indexOf(prefs.fontSize) + 1) % sizes.length];
    setPrefs({ fontSize: next });
  };

  const cycleFontFamily = () => {
    const families = ["sans", "serif", "mono"];
    const current = prefs.fontFamily || "sans";
    const next = families[(families.indexOf(current) + 1) % families.length];
    setPrefs({ fontFamily: next });
  };

  const cycleTimeAnchor = () => {
    const durations = [2, 5, 10, 15];
    const current = prefs.timeAnchorDuration || 5;
    const next = durations[(durations.indexOf(current) + 1) % durations.length];
    setPrefs({ timeAnchorDuration: next });
  };

  const toggleTone = () => {
    setPrefs({ tone: prefs.tone === "gentle" ? "quiet" : "gentle" });
  };

  const resetPrefs = () => {
    setPrefs({
      fontSize: "normal",
      fontFamily: "sans",
      tone: "quiet",
      audio: false,
      textLength: "normal",
      highContrast: false,
      timeAnchorDuration: 5,
    });
  };

  const formatLabel = (label, value) => {
    return `${label}: ${value.charAt(0).toUpperCase() + value.slice(1)} ✓`;
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-center mb-6 text-stone-800">
        Settings
      </h1>
      
      <div className="mb-6">
        <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">
          My Support Needs
        </label>
        <textarea
          className="w-full p-4 rounded-2xl bg-stone-100 border-none focus:ring-2 focus:ring-stone-800 outline-none text-stone-800 placeholder-stone-400 resize-none"
          rows="3"
          placeholder="e.g., 'I get overwhelmed easily', 'I need extra detail', 'Don't use metaphors'"
          value={prefs.supportNeeds}
          onChange={(e) => setPrefs({ supportNeeds: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Button
          variant="secondary"
          text={formatLabel("Size", prefs.fontSize)}
          onClick={cycleFont}
        />
        <Button
          variant="secondary"
          text={formatLabel("Style", prefs.fontFamily || "sans")}
          onClick={cycleFontFamily}
        />
        <Button
          variant="secondary"
          text={formatLabel("Tone", prefs.tone)}
          onClick={toggleTone}
        />
        <Button
          variant="secondary"
          text={`Audio: ${prefs.audio ? "On ✓" : "Off"}`}
          onClick={() => setPrefs({ audio: !prefs.audio })}
        />
        <Button
          variant="secondary"
          text={`High Contrast: ${prefs.highContrast ? "On ✓" : "Off"}`}
          onClick={() => setPrefs({ highContrast: !prefs.highContrast })}
        />
        <Button
          variant="secondary"
          text={`Time Anchor: ${prefs.timeAnchorDuration || 5}m`}
          onClick={cycleTimeAnchor}
        />
        <Button
          variant="secondary"
          text={formatLabel("Length", prefs.textLength === "short" ? "Short" : "Normal")}
          onClick={() => setPrefs({ textLength: prefs.textLength === "short" ? "normal" : "short" })}
        />
        <Button
          variant="secondary"
          text="Reset to Defaults"
          onClick={resetPrefs}
        />
      </div>
      <div className="mt-6">
        <Button text="Back" onClick={onBack} />
      </div>
    </Card>
  );
}