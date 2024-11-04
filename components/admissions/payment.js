import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";

function PaymentComponent() {
  const [paymentData, setPaymentData] = React.useState({
    paymentMethod: "",
    transactionId: "",
    amount: "",
  });

  const paymentMethods = [
    "Credit Card",
    "Debit Card",
    "PayPal",
    "Bank Transfer",
  ];

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission
    console.log("Payment Data:", paymentData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Payment Information</h1>
      <form onSubmit={handleSubmit}>
        {/* Payment Method Field */}
        <div className="mb-4">
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Payment Method</InputLabel>
            <Select
              label="Payment Method"
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleChange}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* Transaction ID Field */}
        <div className="mb-4">
          <TextField
            label="Transaction ID"
            variant="outlined"
            fullWidth
            name="transactionId"
            value={paymentData.transactionId}
            onChange={handleChange}
            required
          />
        </div>
        {/* Amount Field */}
        <div className="mb-4">
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            name="amount"
            type="number"
            value={paymentData.amount}
            onChange={handleChange}
            required
          />
        </div>
        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit Payment
        </Button>
      </form>
    </div>
  );
}

export default PaymentComponent;
