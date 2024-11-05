// components/admissions/AdmissionForm.js

import { useState } from "react";
import {
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Admission Form
      </Typography>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

        <Button variant="contained" color="primary" type="submit">
          Submit Application
        </Button>
      </form>
    </div>
  );
}
