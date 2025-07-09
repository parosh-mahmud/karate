// components/emails/ConfirmationEmail.jsx
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

// ## Add registrationNumber to the props ##
export const ConfirmationEmail = ({
  name = "Participant",
  registrationNumber = "N/A",
}) => (
  <Html>
    <Head />
    <Preview>Your Run Registration is Confirmed!</Preview>
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
            We are thrilled to confirm your registration for the **July Run
            2025**. Your payment has been successfully verified.
          </Text>

          {/* ## ADDED THIS SECTION ## */}
          <Section
            style={{
              border: "1px solid #eaeaea",
              borderRadius: "5px",
              padding: "10px 20px",
              marginTop: "20px",
            }}
          >
            <Text style={{ color: "#4a5568", fontSize: "14px" }}>
              Your Official Registration Number is:
            </Text>
            <Text
              style={{
                color: "#0d6efd",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0",
              }}
            >
              #{registrationNumber}
            </Text>
            <Text
              style={{ color: "#7f8c8d", fontSize: "12px", marginTop: "5px" }}
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
            We look forward to seeing you there!
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ConfirmationEmail;
