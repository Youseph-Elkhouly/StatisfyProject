import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    address: "",
    graduation_date: "",
    is_canadian_citizen: "true",
    school: "",
    major: "",
    minor: "",
    gpa: "",
  });
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3004/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          address: formData.address,
          graduation_date: formData.graduation_date,
          is_canadian_citizen: formData.is_canadian_citizen,
          school: formData.school,
          major: formData.major,
          minor: formData.minor,
          gpa: formData.gpa,
        }),
      });

      if (response.ok) {
        // Handle success (navigate to login or home page)
        console.log("Registration successful");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Graduation Date"
            variant="outlined"
            type="date"
            name="graduation_date"
            value={formData.graduation_date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="School"
            variant="outlined"
            name="school"
            value={formData.school}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Major"
            variant="outlined"
            name="major"
            value={formData.major}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Minor"
            variant="outlined"
            name="minor"
            value={formData.minor}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="GPA"
            variant="outlined"
            name="gpa"
            value={formData.gpa}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: 2 }}>
            Register
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
};

export default Register;
