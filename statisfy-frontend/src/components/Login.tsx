import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3004/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Handle success (redirect to dashboard or home page)
        console.log("Login successful");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: 2 }}>
            Login
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
};

export default Login;
