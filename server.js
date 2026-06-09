require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Neon
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Global Contact Info Middleware
app.use((req, res, next) => {
  res.locals.contactInfo = {
    phone: "0769329734",
    email: "amutua691@gmail.com",
    name: "Blue Sky Resort"
  };
  next();
});

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/about', (req, res) => res.render('about'));
app.get('/rooms', (req, res) => res.render('rooms'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/booking', (req, res) => res.render('booking', { message: null }));

// Handle Booking Form Submission
app.post('/booking', async (req, res) => {
  const { name, email, phone, room, checkin, checkout } = req.body;
  try {
    await pool.query(
      'INSERT INTO bookings (guest_name, guest_email, guest_phone, room_type, check_in, check_out) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, phone, room, checkin, checkout]
    );
    res.render('booking', { message: 'Reservation submitted successfully! We will contact you soon.' });
  } catch (err) {
    console.error(err);
    res.render('booking', { message: 'Something went wrong. Please try again.' });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
