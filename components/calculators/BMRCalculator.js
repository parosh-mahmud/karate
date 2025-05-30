// components/calculators/BMRCalculator.jsx
import { useState } from "react";

export default function BMRCalculator() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState("verylittle");
  const [result, setResult] = useState(null);

  const activityFactors = {
    verylittle: 1.2,
    lightly: 1.375,
    moderately: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const calcBMR = () => {
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const h = parseFloat(heightFt) * 30.48 + parseFloat(heightIn) * 2.54;
    let bmr;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    const tdee = Math.round(bmr * activityFactors[activity]);
    setResult(tdee);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-body">
      <div className="flex space-x-4 mb-4">
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            gender === "male"
              ? "bg-brandAccent text-brandTextOnAccent"
              : "border border-brandAccent text-brandAccent"
          }`}
          onClick={() => setGender("male")}
        >
          Male
        </button>
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            gender === "female"
              ? "bg-brandAccent text-brandTextOnAccent"
              : "border border-brandAccent text-brandAccent"
          }`}
          onClick={() => setGender("female")}
        >
          Female
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-brandTextSecondary mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            placeholder="Weight in Kg"
          />
        </div>

        <div>
          <label className="block text-brandTextSecondary mb-1">
            Age (years)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            placeholder="Age in years"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-brandTextSecondary mb-1">
              Height (ft)
            </label>
            <input
              type="number"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-brandTextSecondary mb-1">
              Height (in)
            </label>
            <input
              type="number"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-brandTextSecondary mb-1">
            Activity Level
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
          >
            <option value="verylittle">Very Little</option>
            <option value="lightly">Lightly Active</option>
            <option value="moderately">Moderately Active</option>
            <option value="very">Very Active</option>
            <option value="extra">Extra Active</option>
          </select>
        </div>
      </div>

      <button
        onClick={calcBMR}
        className="mt-4 w-full bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent py-2 rounded-lg font-medium"
      >
        Calculate Calorie Needs
      </button>

      {result !== null && (
        <p className="mt-4 text-center text-lg font-semibold text-brandTextPrimary">
          Your TDEE: {result} kcal/day
        </p>
      )}
    </div>
  );
}
