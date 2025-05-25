// pages/api/trainers.js
let trainers = []; // in-memory; reset on server restart

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(trainers);
  }
  if (req.method === "POST") {
    const { name, specialization, bio, photoUrl } = req.body;
    if (!name || !specialization || !bio || !photoUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newTrainer = {
      id: `t${Date.now()}`,
      name,
      specialization,
      bio,
      photoUrl,
    };
    trainers.push(newTrainer);
    return res.status(201).json(newTrainer);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
