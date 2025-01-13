import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert, Grid, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all required fields are filled
        if (!formData.full_name || !formData.email || !formData.address || !formData.graduation_date || !formData.school || !formData.major) {
            setError("Please fill in all required fields.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:3002/register", {  // Update port if changed
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });            
    
            if (response.ok) {
                navigate("/"); // Redirect after successful registration
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
                <Typography variant="h4" gutterBottom>Register</Typography>
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Are you a Canadian Citizen?</InputLabel>
                        <Select
                            name="is_canadian_citizen"
                            value={formData.is_canadian_citizen}
                            onChange={handleChange}
                            label="Are you a Canadian Citizen?"
                        >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </FormControl>
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
                    <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: 2 }} disabled={!formData.full_name || !formData.email || !formData.address || !formData.graduation_date || !formData.school || !formData.major || !formData.gpa}>
                        Register
                    </Button>
                </form>
                {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
            </Box>
        </Container>
    );
};

export default Register;
