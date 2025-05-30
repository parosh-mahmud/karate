// components/calculators/MacroCalculator.js
import { useState } from "react";

export default function MacroCalculator() {
  const [calories, setCalories] = useState("");
  const [plan, setPlan] = useState("highcarb");
  const [macros, setMacros] = useState(null);

  const ratios = {
    highcarb: [0.6, 0.25, 0.15],
    moderate: [0.5, 0.3, 0.2],
    zone: [0.4, 0.3, 0.3],
    lowcarb: [0.25, 0.35, 0.4],
    keto: [0.05, 0.35, 0.6],
  };

  const calcMacros = () => {
    const cal = parseFloat(calories) || 0;
    const [cRatio, pRatio, fRatio] = ratios[plan];
    const carbs = Math.round((cal * cRatio) / 4);
    const protein = Math.round((cal * pRatio) / 4);
    const fats = Math.round((cal * fRatio) / 9);
    setMacros({ carbs, protein, fats });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-body">
      <div className="mb-4">
        <label className="block text-brandTextSecondary mb-1">
          Total calories per day
        </label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="e.g. 2000"
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { key: "highcarb", label: "High Carb (60:25:15)" },
          { key: "moderate", label: "Moderate Carb (50:30:20)" },
          { key: "zone", label: "Zone Diet (40:30:30)" },
          { key: "lowcarb", label: "Low Carb (25:35:40)" },
          { key: "keto", label: "Keto Diet (05:35:60)" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setPlan(item.key)}
            className={`py-2 px-3 text-sm font-medium rounded-lg border transition ${
              plan === item.key
                ? "border-brandAccent bg-brandAccent text-brandTextOnAccent"
                : "border-gray-200 text-brandTextSecondary hover:border-brandAccent hover:text-brandAccent"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        onClick={calcMacros}
        className="w-full bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent py-2 rounded-lg font-medium transition"
      >
        Calculate Macros
      </button>

      {macros && (
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-brandAccent">
              {macros.carbs}g
            </p>
            <p className="text-sm text-brandTextSecondary">Carbs</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-brandAccent">
              {macros.protein}g
            </p>
            <p className="text-sm text-brandTextSecondary">Protein</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-brandAccent">
              {macros.fats}g
            </p>
            <p className="text-sm text-brandTextSecondary">Fats</p>
          </div>
        </div>
      )}
    </div>
  );
}
