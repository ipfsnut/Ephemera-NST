const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(morgan('dev'));
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Event routes
app.use('/api/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});module.exports = app;