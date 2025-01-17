import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            setError("Please enter a valid email.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3004/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const user = await response.json();
                if (user.id) {
                    navigate(`/account/${user.id}`);
                } else {
                    setError("Invalid response from server.");
                }
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
