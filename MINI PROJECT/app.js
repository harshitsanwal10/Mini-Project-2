const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000; // Choose any port you prefer

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '@Sanwal86',
    database: 'test_forms',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle form submissions
app.post('/process_form', (req, res) => {
    const { name, email, mobile, case_type } = req.body;

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Error connecting to the database' });
        }

        // Insert data into the database
        const sql = 'INSERT INTO form_responses (name, email, mobile, case_type) VALUES (?, ?, ?, ?)';
        connection.query(sql, [name, email, mobile, case_type], (err, result) => {
            connection.release(); // Release the connection back to the pool

            if (err) {
                return res.status(500).json({ error: 'Error executing the query' });
            }

            return res.status(200).json({ message: 'Form submitted successfully!' });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
