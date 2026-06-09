require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Neon Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Neon secure connection
});

// Middleware to parse form data and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve all static files (CSS, images, additional pages) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Force the root URL to serve index.html safely
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle Booking Form Submission
app.post('/api/booking', async (req, res) => {
  const { name, email, phone, room, checkin, checkout } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO bookings (guest_name, guest_email, guest_phone, room_type, check_in, check_out) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, phone, room, checkin, checkout]
    );
    // Redirects back to booking page with a success query string parameter
    res.redirect('/booking.html?status=success');
  } catch (err) {
    console.error("Database Error:", err);
    // Redirects back to booking page with an error query string parameter
    res.redirect('/booking.html?status=error');
  }
});

// Catch-all route to redirect back to home page if a user hits a non-existent URL
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start Server
app.listen(port, () => {
  console.log(`Blue Sky Resort server successfully running on port ${port}`);
});
