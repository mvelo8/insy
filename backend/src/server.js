require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // ADD mongoose to check connection status
const connectDB = require('./config/database');
const {
  securityHeaders,
  limiter,
  hpp,
  mongoSanitize
} = require('./middleware/security');

// Connect to MongoDB (non-blocking)
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security Middleware
app.use(securityHeaders);
app.use(limiter);
app.use(hpp());
app.use(mongoSanitize());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Demo mode middleware - ADD THIS SECTION
app.use((req, res, next) => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    req.demoMode = true;
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    success: true,
    status: 'OK',
    message: 'International Payments API is running securely (HTTP mode)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbStatus,
    demoMode: dbStatus === 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    success: true,
    message: 'International Payments API is running (HTTP mode)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    demoMode: dbStatus === 'disconnected',
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
app.listen(PORT, '0.0.0.0', () => {
  const dbStatus = mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️ Demo Mode';
  
  console.log('═'.repeat(60));
  console.log('🌐 International Payments API Server (HTTP Mode)');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${dbStatus}`);
  console.log('✅ CORS Enabled for frontend communication');
  console.log('✅ Safe for local development');
  console.log('═'.repeat(60));
});

module.exports = app;