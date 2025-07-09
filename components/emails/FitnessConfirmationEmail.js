// components/emails/FitnessConfirmationEmail.jsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from "@react-email/components";

export const FitnessConfirmationEmail = ({
  name = "Participant",
  registrationNumber = "N/A",
}) => (
  <Html>
    <Head />
    <Preview>Your Fitness Seminar Registration is Confirmed!</Preview>
    <Body
      style={{ backgroundColor: "#f7fafc", fontFamily: "Arial, sans-serif" }}
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
          <Heading style={{ color: "#2d3748", fontSize: "24px" }}>
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
            We're excited to confirm your registration for the ** Fitness &
            Self-Defense Seminar**. Your payment has been verified.
          </Text>

          <Section
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "5px",
              padding: "10px 20px",
              marginTop: "20px",
            }}
          >
            <Text style={{ color: "#4a5568", fontSize: "14px" }}>
              Your Registration Number is:
            </Text>
            <Text
              style={{
                color: "#14b8a6",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0",
              }}
            >
              #{registrationNumber}
            </Text>
            <Text
              style={{ color: "#718096", fontSize: "12px", marginTop: "5px" }}
            >
              Please keep this number for your reference.
            </Text>
          </Section>

          <Text
            style={{
              color: "#4a5568",
              fontSize: "16px",
              lineHeight: "24px",
              marginTop: "20px",
            }}
          >
            Get ready for an informative and empowering session. We look forward
            to seeing you there!
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default FitnessConfirmationEmail;
