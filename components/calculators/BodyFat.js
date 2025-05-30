// components/calculators/BodyFat.js
import { useState } from "react";

export default function BodyFatCalculator() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [wrist, setWrist] = useState("");
  const [hip, setHip] = useState("");
  const [forearm, setForearm] = useState("");
  const [result, setResult] = useState(null);

  const calculateBodyFat = () => {
    const w = parseFloat(weight) || 0;
    const waistIn = parseFloat(waist) || 0;
    const wristIn = parseFloat(wrist) || 0;
    const hipIn = parseFloat(hip) || 0;
    const forearmIn = parseFloat(forearm) || 0;

    // Convert kg → lbs
    const weightLbs = w * 2.20462;

    // YMCA-type formula (in lbs & inches)
    const lbm =
      0.732 * weightLbs +
      8.987 +
      wristIn / 3.14 -
      waistIn * 0.157 -
      hipIn * 0.249 +
      forearmIn * 0.434;

    const fatLbs = weightLbs - lbm;
    const fatPct = (fatLbs / weightLbs) * 100;

    setResult(fatPct.toFixed(1));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-body">
      {/* Gender toggle */}
      <div className="flex space-x-4 mb-4">
        {["male", "female"].map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              gender === g
                ? "bg-brandAccent text-brandTextOnAccent"
                : "border border-brandAccent text-brandAccent"
            }`}
          >
            {g === "male" ? "Male" : "Female"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-brandTextSecondary mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight in KG"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-brandTextSecondary mb-1">
            Waist (in)
          </label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder="Waist in Inches"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-brandTextSecondary mb-1">
              Wrist (in)
            </label>
            <input
              type="number"
              value={wrist}
              onChange={(e) => setWrist(e.target.value)}
              placeholder="Wrist in Inches"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-brandTextSecondary mb-1">
              Hip (in)
            </label>
            <input
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder="Hip in Inches"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-brandTextSecondary mb-1">
            Forearm (in)
          </label>
          <input
            type="number"
            value={forearm}
            onChange={(e) => setForearm(e.target.value)}
            placeholder="Forearm in Inches"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
          />
        </div>

        <p className="text-sm text-brandAccent hover:underline cursor-pointer">
          Don't know measurements?
        </p>
      </div>

      {/* Calculate button */}
      <button
        onClick={calculateBodyFat}
        className="mt-6 w-full bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent py-2 rounded-lg font-medium transition"
      >
        Calculate Your Fat
      </button>

      {/* Result */}
      {result !== null && (
        <p className="mt-4 text-center text-lg font-semibold text-brandTextPrimary">
          Your Body Fat: {result}%
        </p>
      )}
    </div>
  );
}
