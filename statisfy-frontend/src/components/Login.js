import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting login for email:", email);

        if (!email) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3004/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const user = await response.json();
                console.log("User fetched from backend:", user);

                if (user.id) {
                    // Save user ID in localStorage for later use
                    localStorage.setItem("userId", user.id);
                    navigate(`/account/${user.id}`);
                } else {
                    console.error("User ID is missing from response");
                    setError("Invalid response from the server.");
                }
            } else {
                console.error("Login failed with status:", response.status);
                setError("Login failed. Please check your email.");
            }
        } catch (err) {
            console.error("Error during login request:", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: "center", marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: 2 }}>
                        Login
                    </Button>
                </form>
                {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2">
                        Don't have an account? <a href="/register">Register here</a>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
