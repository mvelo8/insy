const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'CAD', 'AUD'],
    uppercase: true
  },
  recipient: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true,
    match: [/^[A-Za-z\s]{2,100}$/, 'Recipient name must be 2-100 characters with only letters and spaces']
  },
  recipientAccount: {
    type: String,
    required: [true, 'Recipient account is required'],
    match: [/^[A-Za-z0-9]{8,34}$/, 'Recipient account must be 8-34 alphanumeric characters']
  },
  swiftCode: {
    type: String,
    required: [true, 'SWIFT code is required'],
    match: [/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Please enter a valid SWIFT/BIC code']
  },
  purpose: {
    type: String,
    required: [true, 'Payment purpose is required'],
    trim: true,
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);