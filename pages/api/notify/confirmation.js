// pages/api/notify/confirmation.js
import { Resend } from "resend";
import { ConfirmationEmail } from "../../../components/emails/ConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ## MODIFIED: Destructure registrationNumber ##
    const { name, email, registrationNumber } = req.body;

    if (!name || !email || !registrationNumber) {
      return res
        .status(400)
        .json({ error: "Name, email, and registration number are required." });
    }

    const { data, error } = await resend.emails.send({
      from: "JK Combat <support@jkcombatacademy.com>", // Use your verified domain
      to: [email],
      subject: `Registration Confirmed for July Run 5k (Reg #${registrationNumber})`,

      // ## MODIFIED: Pass prop to the component ##
      react: ConfirmationEmail({ name, registrationNumber }),
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
