import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";

const Account = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`http://localhost:3000/user/${id}`);
            const data = await response.json();
            setUser(data);
        };

        fetchUser();
    }, [id]);

    if (!user) return <p>Loading...</p>;

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: "center", marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>Welcome, {user.full_name}</Typography>
                <Card sx={{ marginTop: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Email: {user.email}</Typography>
                        <Typography variant="body1">Address: {user.address}</Typography>
                        <Typography variant="body1">Graduation Date: {user.graduation_date}</Typography>
                        <Typography variant="body1">School: {user.school}</Typography>
                        <Typography variant="body1">Major: {user.major}</Typography>
                        <Typography variant="body1">Minor: {user.minor}</Typography>
                        <Typography variant="body1">GPA: {user.gpa}</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Account;
