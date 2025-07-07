// pages/api/notify/confirmation.js
import { Resend } from "resend";
import { ConfirmationEmail } from "../../../components/emails/ConfirmationEmail";

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
      from: "JK Combat Academy <support@jkcombatacademy.com>", // MUST be a verified domain in Resend
      to: [email],
      subject: "Your Running Seminar Registration is Confirmed!",
      react: ConfirmationEmail({ name }),
    });

    if (error) {
      console.error("Resend error:", error);
      return res
        .status(400)
        .json({ error: "Failed to send confirmation email." });
    }

    res
      .status(200)
      .json({ message: "Confirmation email sent successfully.", data });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
}
