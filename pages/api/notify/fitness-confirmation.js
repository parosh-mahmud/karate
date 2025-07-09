// pages/api/notify/fitness-confirmation.js
import { Resend } from "resend";
import { FitnessConfirmationEmail } from "../../../components/emails/FitnessConfirmationEmail";

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Destructure the required data from the request body
    const { name, email, registrationNumber } = req.body;

    // Validate that all necessary data is present
    if (!name || !email || !registrationNumber) {
      return res
        .status(400)
        .json({ error: "Name, email, and registration number are required." });
    }

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "JK Combat Academy <support@jkcombatacademy.com>", // IMPORTANT: Use your verified domain
      to: [email],
      subject: `Registration Confirmed: Fitness & Self-Defense Seminar (Reg #${registrationNumber})`,
      react: FitnessConfirmationEmail({ name, registrationNumber }),
    });

    // Handle potential errors from Resend
    if (error) {
      console.error("Resend error:", error);
      return res
        .status(400)
        .json({ error: "Failed to send confirmation email." });
    }

    // Send a success response
    res.status(200).json({ message: "Confirmation email sent successfully." });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
}
