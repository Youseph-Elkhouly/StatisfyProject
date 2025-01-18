import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Card, CardContent, Button, List, ListItem, CircularProgress } from "@mui/material";

const Account = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailLoading, setEmailLoading] = useState(false);

    useEffect(() => {
        console.log("Fetching user data for ID:", id);

        const fetchUser = async () => {
            const userId = id || localStorage.getItem("userId");
            try {
                const response = await fetch(`http://localhost:3004/user?id=${userId}`);
                if (!response.ok) throw new Error("Failed to fetch user data.");
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError("Unable to fetch user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleAuth = () => {
        // Redirect to Gmail authentication
        window.location.href = "http://localhost:3004/auth";
    };

    const fetchEmails = async () => {
        setEmailLoading(true);
        try {
            const response = await fetch("http://localhost:3004/fetch-emails");
            if (!response.ok) throw new Error("Failed to fetch emails. Please authenticate first.");
            const data = await response.json();
            setEmails(data);
        } catch (err) {
            alert("An error occurred while fetching emails.");
        } finally {
            setEmailLoading(false);
        }
    };

    if (loading) return <CircularProgress />;

    if (error) return <p style={{ color: "red" }}>{error}</p>;

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
                {/* Gmail API Features */}
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h5" gutterBottom>Gmail Integration</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAuth}
                        sx={{ marginRight: 2 }}
                    >
                        Authenticate with Gmail
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={fetchEmails}
                        disabled={emailLoading}
                    >
                        {emailLoading ? "Fetching Emails..." : "Fetch Emails"}
                    </Button>
                </Box>
                {/* Display Fetched Emails */}
                {emails.length > 0 && (
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant="h6" gutterBottom>Fetched Emails</Typography>
                        <List>
                            {emails.map((email, index) => (
                                <ListItem key={index} sx={{ marginBottom: 2 }}>
                                    <Card variant="outlined" sx={{ padding: 2, width: "100%" }}>
                                        <Typography variant="subtitle1">
                                            <strong>Subject:</strong> {email.subject || "No Subject"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Snippet:</strong> {email.snippet}
                                        </Typography>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Account;
