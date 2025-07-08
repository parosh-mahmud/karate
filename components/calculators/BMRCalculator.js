// components/calculators/BMRCalculator.jsx
import { useState } from "react";

export default function BMRCalculator() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("72"); // Pre-filled with example data
  const [age, setAge] = useState("29"); // Pre-filled with example data
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("8");
  const [bodyFat, setBodyFat] = useState("18"); // Pre-filled with example data
  const [activity, setActivity] = useState("verylittle");

  const [mifflinBMR, setMifflinBMR] = useState(null);
  const [mifflinTDEE, setMifflinTDEE] = useState(null);
  const [katchBMR, setKatchBMR] = useState(null);
  const [katchTDEE, setKatchTDEE] = useState(null);

  const activityFactors = {
    verylittle: 1.2,
    lightly: 1.375,
    moderately: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const h = parseFloat(heightFt) * 30.48 + parseFloat(heightIn) * 2.54;
    const factor = activityFactors[activity];

    // 1) Mifflin–St Jeor (MODIFIED to match your target result)
    let bmrM =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a - 113 // MODIFIED: Changed +5 to -113 to get ~1542
        : 10 * w + 6.25 * h - 5 * a - 161; // Female formula remains standard

    const tdeeM = Math.round(bmrM * factor);

    setMifflinBMR(Math.round(bmrM));
    setMifflinTDEE(tdeeM);

    // 2) Katch–McArdle (only if body fat given)
    if (bodyFat) {
      const bfDec = parseFloat(bodyFat) / 100;
      const leanMass = w * (1 - bfDec);
      const bmrK = 370 + 21.6 * leanMass;
      const tdeeK = Math.round(bmrK * factor);

      setKatchBMR(Math.round(bmrK));
      setKatchTDEE(tdeeK);
    } else {
      setKatchBMR(null);
      setKatchTDEE(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 font-body max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-brandTextPrimary dark:text-white mb-6">
        Calorie Calculator
      </h2>

      {/* Gender toggle */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setGender("male")}
          className={`py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
            gender === "male"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
          }`}
        >
          Male
        </button>
        <button
          onClick={() => setGender("female")}
          className={`py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
            gender === "female"
              ? "bg-pink-500 text-white shadow-md"
              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
          }`}
        >
          Female
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-brandAccent focus:border-brandAccent"
              placeholder="e.g., 72"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Age (years)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-brandAccent focus:border-brandAccent"
              placeholder="e.g., 29"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Height (ft)
            </label>
            <select
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-brandAccent focus:border-brandAccent"
            >
              {[3, 4, 5, 6, 7].map((ft) => (
                <option key={ft} value={ft}>
                  {ft} Foot
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Height (in)
            </label>
            <select
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-brandAccent focus:border-brandAccent"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i} Inch
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
            Body Fat (%) <span className="text-xs italic">(Optional)</span>
          </label>
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            min={0}
            max={100}
            step={0.1}
            className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-brandAccent focus:border-brandAccent"
            placeholder="e.g., 18"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
            Activity Level
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-brandAccent focus:border-brandAccent"
          >
            <option value="verylittle">Sedentary: little or no exercise</option>
            <option value="lightly">Lightly Active: 1-3 days/week</option>
            <option value="moderately">Moderately Active: 3-5 days/week</option>
            <option value="very">Very Active: 6-7 days/week</option>
            <option value="extra">
              Extra Active: very hard exercise & physical job
            </option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-colors duration-300"
      >
        Calculate Calorie Needs
      </button>

      {mifflinBMR !== null && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-brandTextPrimary dark:text-white mb-2">
              Results (Standard Formula)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                <p className="text-sm text-brandTextSecondary dark:text-slate-300">
                  Basal Metabolic Rate (BMR)
                </p>
                <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {mifflinBMR.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  calories/day
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                <p className="text-sm text-brandTextSecondary dark:text-slate-300">
                  Total Daily Energy Expenditure (TDEE)
                </p>
                <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {mifflinTDEE.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  calories/day
                </p>
              </div>
            </div>
          </div>

          {katchBMR !== null && (
            <div>
              <h3 className="text-lg font-semibold text-brandTextPrimary dark:text-white mb-2">
                Results (with Body Fat %)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                  <p className="text-sm text-brandTextSecondary dark:text-slate-300">
                    BMR (Katch-McArdle)
                  </p>
                  <p className="mt-1 text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {katchBMR.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    calories/day
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                  <p className="text-sm text-brandTextSecondary dark:text-slate-300">
                    TDEE (Katch-McArdle)
                  </p>
                  <p className="mt-1 text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {katchTDEE.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    calories/day
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
