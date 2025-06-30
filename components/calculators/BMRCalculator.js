// components/calculators/BMRCalculator.jsx
import { useState } from "react";

export default function BMRCalculator() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("8");
  const [bodyFat, setBodyFat] = useState("");
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

    // 1) Mifflin–St Jeor
    let bmrM =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
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
    <div className="bg-white p-6 rounded-lg shadow-md font-body">
      {/* gender toggle */}
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
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      {/* inputs */}
      <div className="space-y-4">
        {/* weight */}
        <div>
          <label className="block text-brandTextSecondary mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="72"
          />
        </div>

        {/* age */}
        <div>
          <label className="block text-brandTextSecondary mb-1">
            Age (years)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="29"
          />
        </div>

        {/* height */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-brandTextSecondary mb-1">
              Height (ft)
            </label>
            <select
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              {[4, 5, 6, 7].map((ft) => (
                <option key={ft} value={ft}>
                  {ft} Foot
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-brandTextSecondary mb-1">
              Height (in)
            </label>
            <select
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i} Inch
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* body fat */}
        <div>
          <label className="block text-brandTextSecondary mb-1">
            Body Fat (%)
          </label>
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            min={0}
            max={100}
            step={0.1}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="18"
          />
        </div>

        {/* activity */}
        <div>
          <label className="block text-brandTextSecondary mb-1">
            Activity Level
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="verylittle">Very Little</option>
            <option value="lightly">Lightly Active</option>
            <option value="moderately">Moderately Active</option>
            <option value="very">Very Active</option>
            <option value="extra">Extra Active</option>
          </select>
        </div>
      </div>

      {/* calculate */}
      <button
        onClick={calculate}
        className="mt-4 w-full bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent py-2 rounded-lg font-medium"
      >
        Calculate Calorie Needs
      </button>

      {/* results */}
      {mifflinBMR !== null && (
        <div className="mt-6 space-y-6">
          {/* Mifflin–St Jeor */}
          <div>
            <h3 className="text-md font-semibold mb-2">
              Mifflin–St Jeor Results
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4 text-center">
                <p className="text-brandTextSecondary">Your BMR is</p>
                <p className="mt-2 text-3xl font-bold text-brandAccent">
                  {mifflinBMR}
                </p>
              </div>
              <div className="bg-white border rounded-lg p-4 text-center">
                <p className="text-brandTextSecondary">Your TDEE is</p>
                <p className="mt-2 text-3xl font-bold text-brandAccent">
                  {mifflinTDEE}
                </p>
              </div>
            </div>
          </div>

          {/* Katch–McArdle (if body fat given) */}
          {katchBMR !== null && (
            <div>
              <h3 className="text-md font-semibold mb-2">
                Katch–McArdle Results
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4 text-center">
                  <p className="text-brandTextSecondary">Your BMR is</p>
                  <p className="mt-2 text-3xl font-bold text-brandAccent">
                    {katchBMR}
                  </p>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <p className="text-brandTextSecondary">Your TDEE is</p>
                  <p className="mt-2 text-3xl font-bold text-brandAccent">
                    {katchTDEE}
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
