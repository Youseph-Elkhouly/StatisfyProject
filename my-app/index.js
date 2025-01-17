const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3004;

// Enable CORS
app.use(cors({
    origin: "http://localhost:3000", // Allow frontend from port 3000 to access this server
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
