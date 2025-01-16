import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:3004/login", {  // Make sure this is correct
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
    
            if (response.ok) {
                const user = await response.json();
                navigate(`/account/${user.id}`);
            } else {
                setError("Login failed. Please check your email.");
            }
        } catch (err) {
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
