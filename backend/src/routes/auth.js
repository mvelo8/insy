const express = require('express');
const router = express.Router();

// Simple login route
router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint - working',
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
    token: 'mock-jwt-token'
  });
});

// Simple register route
router.post('/register', (req, res) => {
  res.json({
    success: true,
    message: 'Register endpoint - working',
    user: { id: 2, name: 'New User', email: 'new@example.com' }
  });
});

// Simple me route
router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: { id: 1, name: 'Test User', email: 'test@example.com' }
  });
});

module.exports = router;