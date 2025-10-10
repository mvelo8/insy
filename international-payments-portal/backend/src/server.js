require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const {
  securityHeaders,
  limiter,
  hpp,
  mongoSanitize
} = require('./middleware/security');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3002;

// Security Middleware
app.use(securityHeaders);
app.use(limiter);
app.use(hpp());
app.use(mongoSanitize());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'International Payments API is running securely (HTTP mode)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'International Payments API is running (HTTP mode)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      payments: '/api/payments'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start HTTP server
app.listen(PORT, () => {
  console.log('═'.repeat(60));
  console.log('🌐 International Payments API Server (HTTP Mode)');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('✅ Safe for local development');
  console.log('═'.repeat(60));
});

module.exports = app;
