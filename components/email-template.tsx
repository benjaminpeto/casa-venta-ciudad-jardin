import type * as React from "react"

interface EmailTemplateProps {
  name: string
  email: string
  phone?: string
  message: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ name, email, phone, message }) => (
  <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
    <h1 style={{ color: "#000", borderBottom: "2px solid #000", paddingBottom: "10px" }}>New Property Inquiry</h1>
    <div style={{ marginTop: "20px" }}>
      <p style={{ marginBottom: "10px" }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ marginBottom: "10px" }}>
        <strong>Email:</strong> {email}
      </p>
      {phone && (
        <p style={{ marginBottom: "10px" }}>
          <strong>Phone:</strong> {phone}
        </p>
      )}
      <p style={{ marginBottom: "10px" }}>
        <strong>Message:</strong>
      </p>
      <p
        style={{
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderLeft: "4px solid #000",
          whiteSpace: "pre-wrap",
        }}
      >
        {message}
      </p>
    </div>
    <div
      style={{
        marginTop: "30px",
        paddingTop: "20px",
        borderTop: "1px solid #e5e5e5",
        color: "#666",
        fontSize: "12px",
      }}
    >
      <p>This inquiry was submitted through your luxury property landing page.</p>
    </div>
  </div>
)
