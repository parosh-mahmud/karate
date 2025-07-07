// pages/api/notify/fitness-confirmation.js
import { Resend } from "resend";
import { FitnessConfirmationEmail } from "../../../components/emails/FitnessConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const { data, error } = await resend.emails.send({
      from: "JK Combat Acadymy <support@jkcombatacademy.com>", // Use your verified domain
      to: [email],
      subject: "Your Fitness Seminar Registration is Confirmed!",
      react: FitnessConfirmationEmail({ name }),
    });
    if (error) {
      return res
        .status(400)
        .json({ error: "Failed to send confirmation email." });
    }
    res.status(200).json({ message: "Confirmation email sent successfully." });
  } catch (error) {
    res.status(500).json({ error: "An internal server error occurred." });
  }
}
