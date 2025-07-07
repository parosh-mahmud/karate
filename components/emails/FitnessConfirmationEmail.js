// components/emails/FitnessConfirmationEmail.jsx
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

export const FitnessConfirmationEmail = ({ name = "Participant" }) => (
  <Html>
    <Head />
    <Preview>Your Fitness Seminar Registration is Confirmed!</Preview>
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
            Fitness Registration Confirmed!
          </Heading>
          <Text
            style={{ color: "#4a5568", fontSize: "16px", lineHeight: "24px" }}
          >
            Hello {name},
          </Text>
          <Text
            style={{ color: "#4a5568", fontSize: "16px", lineHeight: "24px" }}
          >
            This email confirms your registration for the **JK Combat Fitness
            Seminar**. Your payment has been verified.
          </Text>
          <Text
            style={{ color: "#4a5568", fontSize: "16px", lineHeight: "24px" }}
          >
            Get ready to kickstart your health and wellness journey. We can't
            wait to see you!
          </Text>
          <Button
            href="https://yourwebsite.com"
            style={{
              backgroundColor: "#0d9488",
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

export default FitnessConfirmationEmail;
