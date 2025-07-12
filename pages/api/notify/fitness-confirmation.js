// // pages/api/notify/fitness-confirmation.js
// import { Resend } from "resend";
// import { FitnessConfirmationEmail } from "../../../components/emails/FitnessConfirmationEmail";

// // Initialize Resend with your API key from environment variables
// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   // Only allow POST requests
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     // Destructure the required data from the request body
//     const { name, email, registrationNumber } = req.body;

//     // Validate that all necessary data is present
//     if (!name || !email || !registrationNumber) {
//       return res
//         .status(400)
//         .json({ error: "Name, email, and registration number are required." });
//     }

//     // Send the email using Resend
//     const { data, error } = await resend.emails.send({
//       from: "JK Combat Academy <support@jkcombatacademy.com>", // IMPORTANT: Use your verified domain
//       to: [email],
//       subject: `Registration Confirmed: Fitness & Self-Defense Seminar (Reg #${registrationNumber})`,
//       react: FitnessConfirmationEmail({ name, registrationNumber }),
//     });

//     // Handle potential errors from Resend
//     if (error) {
//       console.error("Resend error:", error);
//       return res
//         .status(400)
//         .json({ error: "Failed to send confirmation email." });
//     }

//     // Send a success response
//     res.status(200).json({ message: "Confirmation email sent successfully." });
//   } catch (error) {
//     console.error("API error:", error);
//     res.status(500).json({ error: "An internal server error occurred." });
//   }
// }

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FitnessConfirmationEmail } from "../../../components/emails/FitnessConfirmationEmail";
import SibApiV3Sdk from "sib-api-v3-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, registrationNumber } = req.body;

    if (!name || !email || !registrationNumber) {
      return res.status(400).json({
        error: "Name, email, and registration number are required.",
      });
    }

    // Configure Brevo SDK
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    // Render your React email component into static HTML
    const htmlContent = renderToStaticMarkup(
      <FitnessConfirmationEmail
        name={name}
        registrationNumber={registrationNumber}
      />
    );

    // Prepare the email
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = {
      sender: {
        name: "JK Combat Academy",
        email: "support@jkcombatacademy.com", // Must be verified
      },
      to: [{ email, name }],
      subject: `Registration Confirmed: Fitness & Self-Defense Seminar (Reg #${registrationNumber})`,
      htmlContent,
    };

    // Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    // Success response
    res.status(200).json({
      message: "Fitness confirmation email sent successfully.",
      data,
    });
  } catch (error) {
    console.error("Brevo error:", error.response?.body || error.message);
    res.status(500).json({
      error: "Failed to send fitness confirmation email.",
    });
  }
}
