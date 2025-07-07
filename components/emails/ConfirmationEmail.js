// components/emails/ConfirmationEmail.jsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Section,
} from "@react-email/components";

export const ConfirmationEmail = ({ name = "Participant" }) => (
  <Html>
    <Head />
    <Preview>Your Running Seminar Registration is Confirmed!</Preview>
    <Body
      style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}
    >
      <Container
        style={{
          backgroundColor: "#ffffff",
          margin: "0 auto",
          padding: "20px 0 48px",
          width: "580px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Section style={{ padding: "24px", textAlign: "center" }}>
          <Heading style={{ color: "#1a202c", fontSize: "24px" }}>
            Registration Confirmed!
          </Heading>
          <Text
            style={{ color: "#4a5568", fontSize: "16px", lineHeight: "24px" }}
          >
            Hello {name},
          </Text>
          <Text
            style={{ color: "#4a5568", fontSize: "16px", lineHeight: "24px" }}
          >
            We are thrilled to confirm your registration for the **JK Combat
            Running Seminar**. Your payment has been successfully verified.
          </Text>
          <Text
            style={{ color: "#4a5568", fontSize: "16px", lineHeight: "24px" }}
          >
            We look forward to seeing you there and helping you achieve your
            running goals. Further details about the event schedule will be sent
            closer to the date.
          </Text>
          <Button
            href="https://yourwebsite.com" // Link to your website
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
              marginTop: "20px",
              display: "inline-block",
            }}
          >
            Visit Our Website
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ConfirmationEmail;
