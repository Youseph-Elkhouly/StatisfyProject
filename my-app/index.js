const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");

const app = express();
const PORT = 3004;

// OAuth2 Client Setup
const CLIENT_ID = "1010203841296-85dv2e689p5mpkvtig084i6ghviq0amt.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3004/auth/callback";
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Middleware
app.use(cors({ origin: "http://localhost:3000", methods: "GET,POST,PUT,DELETE", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to the API</h1>
        <p>This is the backend server for the application. Available endpoints:</p>
        <ul>
            <li><a href="/register">/register</a> - Registration form</li>
            <li><a href="/db-test">/db-test</a> - Database connection test</li>
            <li><a href="/user">/user</a> - User information (query by email or ID)</li>
        </ul>
    `);
});

// Gmail authentication route
app.get("/auth", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    });
    res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Mock user ID retrieval (replace this with dynamic logic)
        const userId = "a6abfb26-764f-432e-8f1d-2f67e009bd12";

        res.send(`
            <h1>Authentication Successful!</h1>
            <p>You can now fetch your emails.</p>
            <button onclick="window.location.href='http://localhost:3000/account/${userId}'" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
                Go to Your Account
            </button>
        `);
    } catch (error) {
        console.error("Error during authentication:", error.message, error.stack);
        res.status(500).send("Authentication failed.");
    }
});





app.get("/fetch-emails", async (req, res) => {
    try {
        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10,
        });

        const messages = response.data.messages || [];
        const emailDetails = [];

        for (const message of messages) {
            const email = await gmail.users.messages.get({ userId: "me", id: message.id });
            const snippet = email.data.snippet;
            const subject = email.data.payload.headers.find((h) => h.name === "Subject")?.value || "No Subject";

            // Classify the email
            const label = await classifyEmail(snippet);
            if (label === "job-related") {
                // Save to database
                await pool.query(
                    `INSERT INTO job_emails (subject, snippet, sender)
                     VALUES ($1, $2, $3) ON CONFLICT (subject) DO NOTHING`,
                    [subject, snippet, "unknown@unknown.com"]
                );
                console.log(`Saved job-related email: ${subject}`);
                emailDetails.push({ id: message.id, subject, snippet, label });
            } else {
                console.log(`Non-job-related email skipped: ${subject}`);
            }
        }

        res.json(emailDetails);
    } catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).send("An error occurred while fetching emails.");
    }
});



const twilio = require("twilio");
const twilioClient = new twilio("ACe3fe2c3d6c65b01e9360cc13c043a5aa", "08728fc6c887ad27440a402817b0c2f6");

app.post("/send-notification", async (req, res) => {
    const { phone, message } = req.body;

    try {
        await twilioClient.messages.create({
            body: message,
            from: "+15076232899",
            to: phone,
        });
        res.send("Notification sent.");
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).send("Failed to send notification.");
    }
});




// Save Tokens to DB
const saveTokensToDB = async (email, tokens) => {
    try {
        await pool.query(
            `INSERT INTO user_tokens (email, access_token, refresh_token, scope, token_type, expiry_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (email) DO UPDATE
             SET access_token = $2, refresh_token = $3, scope = $4, token_type = $5, expiry_date = $6`,
            [
                email,
                tokens.access_token,
                tokens.refresh_token,
                tokens.scope,
                tokens.token_type,
                tokens.expiry_date,
            ]
        );
    } catch (error) {
        console.error("Error saving tokens to DB:", error);
    }
};

// Example route using saveTokensToDB
app.post("/save-tokens", async (req, res) => {
    const { email, tokens } = req.body;
    try {
        await saveTokensToDB(email, tokens);
        res.send("Tokens saved successfully.");
    } catch (error) {
        res.status(500).send("Failed to save tokens.");
    }
});


const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Load the classifier and vectorizer (use child process to run Python code)
const classifyEmail = (emailContent) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", ["classify_email.py", emailContent]);
        pythonProcess.stdout.on("data", (data) => resolve(data.toString().trim()));
        pythonProcess.stderr.on("data", (data) => reject(data.toString()));
    });
};





// PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DATABASE_HOST || "db",
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "yoyo2015",
    database: process.env.DATABASE_NAME || "myappdb",
});

app.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    console.log('Received email:', email); // Debug log

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log('No user found for email:', email);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Fetched user:', result.rows[0]); // Debug log
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/db-test", async (req, res) => {
    try {
        await pool.query("SELECT 1");  // Simple query to check the connection
        res.send("Database connection successful!");
    } catch (err) {
        console.error("Database connection error:", err.message);
        res.status(500).send("Failed to connect to the database");
    }
});

// Handle user login
app.post("/login", async (req, res) => {
    const { email } = req.body;

    console.log("Login attempt for email:", email); // Debug log

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            console.log("No account found for email:", email); // Debug log
            return res.status(404).json({ error: "No account found with the provided email." });
        }

        console.log("User found:", result.rows[0]); // Debug log
        res.json(result.rows[0]); // Ensure 'id' is included in response
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Error logging in");
    }
});

// Handle user registration
app.post("/register", async (req, res) => {
    const {
        full_name,
        email,
        address,
        graduation_date,
        is_canadian_citizen,
        school,
        major,
        minor,
        gpa,
    } = req.body;

    console.log("Received data:", req.body);  // Log the received data

    if (!full_name || !email || !address || !graduation_date || !school || !major) {
        return res.status(400).send("Missing required fields");
    }

    const userId = uuidv4();

    try {
        const result = await pool.query(
            `INSERT INTO users (id, full_name, email, address, graduation_date, is_canadian_citizen, school, major, minor, gpa)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [userId, full_name, email, address, graduation_date, is_canadian_citizen, school, major, minor, gpa]
        );
        res.send(`Registration successful!`);
    } catch (err) {
        console.error("Error registering user:", err.message);
        res.status(500).send(`Error registering user: ${err.message}`);
    }
});

app.get('/user', async (req, res) => {
    const { email, id } = req.query;
    try {
        let query = '';
        let value = '';
        if (id) {
            query = 'SELECT * FROM users WHERE id = $1';
            value = id;
        } else if (email) {
            query = 'SELECT * FROM users WHERE email = $1';
            value = email;
        } else {
            return res.status(400).json({ error: 'Email or ID required' });
        }

        const result = await pool.query(query, [value]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Serve the registration form
app.get("/register", (req, res) => {
    res.send(`
        <form action="/register" method="POST">
            <label for="full_name">Full Name:</label><br>
            <input type="text" id="full_name" name="full_name" required><br><br>

            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br><br>

            <label for="address">Address:</label><br>
            <textarea id="address" name="address" required></textarea><br><br>

            <label for="graduation_date">Graduation Date:</label><br>
            <input type="date" id="graduation_date" name="graduation_date" required><br><br>

            <label for="is_canadian_citizen">Are you a Canadian Citizen?</label><br>
            <select id="is_canadian_citizen" name="is_canadian_citizen" required>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select><br><br>

            <label for="school">School:</label><br>
            <input type="text" id="school" name="school" required><br><br>

            <label for="major">Major:</label><br>
            <input type="text" id="major" name="major" required><br><br>

            <label for="minor">Minor:</label><br>
            <input type="text" id="minor" name="minor"><br><br>

            <label for="gpa">GPA:</label><br>
            <input type="number" step="0.01" id="gpa" name="gpa" required><br><br>

            <button type="submit">Register</button>
        </form>
    `);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
