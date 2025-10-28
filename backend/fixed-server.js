// fixed-server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend running on correct port 3001!',
    timestamp: new Date().toISOString()
  });
});

// Payment endpoint - THIS FIXES YOUR ERROR
app.post('/api/payments', (req, res) => {
  console.log('💳 Payment received:', req.body);
  
  res.json({
    success: true,
    message: 'DEMO: 1 payment submitted to SWIFT!',
    transactionId: 'SWIFT_' + Date.now(),
    amount: req.body.amount,
    currency: req.body.currency || 'USD',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log('═'.repeat(50));
  console.log('🚀 BACKEND RUNNING ON PORT 3001');
  console.log('✅ Frontend will now connect successfully!');
  console.log('✅ "Backend connection failed" error FIXED');
  console.log('═'.repeat(50));
});