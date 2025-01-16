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

// Serve the login page
app.get("/", (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form action="/login" method="POST">
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br><br>
            <button type="submit">Login</button>
        </form>
        <br>
        <p>Don't have an account? <a href="/register">Register here</a></p>
    `);
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

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(404).send("No account found with the provided email.");
        }

        // Send the user details back
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error logging in:", err.message);
        res.status(500).send("Error logging in");
    }
});

// Handle user registration
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





// User account page
app.get("/user/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("User not found");
        }

        const user = result.rows[0];
        res.send(`
            <h1>Welcome, ${user.full_name}</h1>
            <p>Email: ${user.email}</p>
            <p>Address: ${user.address}</p>
            <p>Graduation Date: ${user.graduation_date}</p>
            <p>School: ${user.school}</p>
            <p>Major: ${user.major}</p>
            <p>Minor: ${user.minor}</p>
            <p>GPA: ${user.gpa}</p>
            <br>
            <a href="/">Log out</a>
        `);
    } catch (err) {
        console.error("Error fetching user:", err.message);
        res.status(500).send("Error fetching user");
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
