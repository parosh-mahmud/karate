import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Breadcrumbs,
  Typography,
} from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import PaymentComponent from "../../components/admissions/payment";
function AdmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    beltLevel: "",
    email: "",
    phone: "",
  });
  const [showPayment, setShowPayment] = useState(false); // State variable to track view

  const beltLevels = [
    "White",
    "Yellow",
    "Orange",
    "Green",
    "Blue",
    "Purple",
    "Brown",
    "Red",
    "Black",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true); // Show the Payment component
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="textPrimary" className="flex items-center">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Admission Form
        </Typography>
        {showPayment && (
          <Typography color="textPrimary">Payment Information</Typography>
        )}
      </Breadcrumbs>

      {!showPayment ? (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Karate Academy Admission Form
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Age Field */}
            <div className="mb-4">
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                name="age"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            {/* Belt Level Field */}
            <div className="mb-4">
              <TextField
                label="Belt Level"
                variant="outlined"
                fullWidth
                select
                name="beltLevel"
                value={formData.beltLevel}
                onChange={handleChange}
                required
              >
                {beltLevels.map((belt) => (
                  <MenuItem key={belt} value={belt}>
                    {belt}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            {/* Email Field */}
            <div className="mb-4">
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* Phone Field */}
            <div className="mb-4">
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                name="phone"
                type="tel"
                inputProps={{ pattern: "[0-9]{10,15}" }} // Optional validation for phone number
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            {/* Submit Button */}
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Next
            </Button>
          </form>
        </>
      ) : (
        <PaymentComponent />
      )}
    </div>
  );
}

export default AdmissionForm;
