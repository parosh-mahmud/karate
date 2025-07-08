// components/calculators/BodyFat.js
import { useState } from "react";

export default function BodyFatCalculator() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("64");
  const [waist, setWaist] = useState("30");
  const [wrist, setWrist] = useState("7");
  const [hip, setHip] = useState("38");
  const [forearm, setForearm] = useState("10.5");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateBodyFat = () => {
    const w = parseFloat(weight);
    const waistIn = parseFloat(waist);
    const wristIn = parseFloat(wrist);
    const hipIn = parseFloat(hip);
    const forearmIn = parseFloat(forearm);

    // Validation
    if (!w || !waistIn) {
      setError("Weight and Waist are required for all calculations.");
      setResult(null);
      return;
    }
    if (gender === "female" && (!wristIn || !hipIn || !forearmIn)) {
      setError(
        "Wrist, Hip, and Forearm are required for the female calculation."
      );
      setResult(null);
      return;
    }

    setError("");
    const weightLbs = w * 2.20462;
    let lbm; // Lean Body Mass

    // ## FINAL FIX: Using the correct, separate formulas for each gender ##
    if (gender === "male") {
      // This formula for men uses ONLY weight and waist to get the correct 13.12% result.
      lbm = 1.082 * weightLbs - 4.15 * waistIn + 94.42;
    } else {
      // This formula for women uses all measurements.
      lbm =
        0.732 * weightLbs +
        8.987 +
        wristIn / 3.14 -
        waistIn * 0.157 -
        hipIn * 0.249 +
        forearmIn * 0.434;
    }

    const fatLbs = weightLbs - lbm;
    const fatPct = (fatLbs / weightLbs) * 100;

    if (fatPct < 2 || fatPct > 60) {
      setError(
        "Calculation resulted in an unlikely value. Please double-check your measurements."
      );
      setResult(null);
    } else {
      setResult(fatPct.toFixed(2));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 font-body max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-brandTextPrimary dark:text-white mb-6">
        Body Fat Calculator
      </h2>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setGender("male")}
          className={`py-3 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${gender === "male" ? "bg-blue-600 text-white shadow-md" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"}`}
        >
          <span className="text-lg">♂</span> Male
        </button>
        <button
          onClick={() => setGender("female")}
          className={`py-3 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${gender === "female" ? "bg-pink-500 text-white shadow-md" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"}`}
        >
          <span className="text-lg">♀</span> Female
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Waist (in)
            </label>
            <input
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Wrist (in)
            </label>
            <input
              type="number"
              value={wrist}
              onChange={(e) => setWrist(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Hip (in)
            </label>
            <input
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
            Forearm (in)
          </label>
          <input
            type="number"
            value={forearm}
            onChange={(e) => setForearm(e.target.value)}
            className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* ## FINAL FIX ## - Conditional note to prevent user confusion */}
        {gender === "male" && (
          <div className="text-xs text-center text-slate-500 dark:text-slate-400 pt-1">
            Note: To ensure accuracy, the male formula uses only Weight and
            Waist. Other measurements are not factored into the calculation.
          </div>
        )}
      </div>

      <button
        onClick={calculateBodyFat}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-colors duration-300"
      >
        Calculate Body Fat
      </button>

      {error && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}

      {result !== null && (
        <div className="mt-6 text-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <p className="text-sm font-medium text-brandTextSecondary dark:text-slate-300">
            Estimated Body Fat
          </p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {result}%
          </p>
        </div>
      )}
    </div>
  );
}
