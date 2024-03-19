const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const connection = mysql.createConnection({
  // Depends on what you're running on
  // host: 'localhost',
  host: '127.0.0.1',
  user: 'root',
  // Depends on password you created
  password: 'password',
  database: 'CapstoneGymApp',
  // Depends on your specific port number
  port: 3307
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Query to check if user with provided email and password exists
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If user exists, send success response
    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      // If user doesn't exist or credentials are incorrect, send error response
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Endpoint for user sign up
app.post('/signup', (req, res) => {
  const { email, password, role } = req.body;
  
  // Query to insert new user into database
  const sql = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
  connection.query(sql, [email, password, role], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Send success response
    res.status(201).json({ message: 'User created successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
