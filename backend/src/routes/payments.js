const express = require('express');
const router = express.Router();

// Simple payments route
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        amount: 1000,
        currency: 'USD',
        recipient: 'John Doe',
        status: 'completed'
      }
    ],
    message: 'Payments retrieved successfully'
  });
});

// Simple create payment route
router.post('/', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 2,
      amount: req.body.amount || 500,
      currency: req.body.currency || 'USD',
      recipient: req.body.recipient || 'Test Recipient',
      status: 'pending'
    },
    message: 'Payment created successfully'
  });
});

// Simple supported currencies route
router.get('/currencies/supported', (req, res) => {
  res.json({
    success: true,
    data: [
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'GBP', name: 'British Pound' }
    ]
  });
});

module.exports = router;