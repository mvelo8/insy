const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { body, validationResult } = require('express-validator');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Input validation rules with RegEx whitelisting
const validationRules = {
  register: [
    body('email')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('name')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
      .matches(/^[A-Za-z\s]+$/).withMessage('Name can only contain letters and spaces'),
    body('accountNumber')
      .isLength({ min: 8, max: 20 }).withMessage('Account number must be between 8 and 20 characters')
      .matches(/^[A-Za-z0-9]+$/).withMessage('Account number can only contain letters and numbers'),
    body('idNumber')
      .isLength({ min: 6, max: 20 }).withMessage('ID number must be between 6 and 20 characters')
      .matches(/^[A-Za-z0-9]+$/).withMessage('ID number can only contain letters and numbers')
  ],
  login: [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  payment: [
    body('amount')
      .isFloat({ min: 0.01 }).withMessage('Amount must be a number greater than 0'),
    body('currency')
      .isIn(['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'CAD', 'AUD']).withMessage('Please select a valid currency'),
    body('recipient')
      .isLength({ min: 2, max: 100 }).withMessage('Recipient name must be between 2 and 100 characters')
      .matches(/^[A-Za-z\s]+$/).withMessage('Recipient name can only contain letters and spaces'),
    body('recipientAccount')
      .isLength({ min: 8, max: 34 }).withMessage('Recipient account must be between 8 and 34 characters')
      .matches(/^[A-Za-z0-9]+$/).withMessage('Recipient account can only contain letters and numbers'),
    body('swiftCode')
      .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/).withMessage('Please enter a valid SWIFT/BIC code'),
    body('purpose')
      .isLength({ min: 2, max: 200 }).withMessage('Purpose must be between 2 and 200 characters')
      .trim()
      .escape()
  ]
};

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

module.exports = {
  limiter,
  validationRules,
  validate,
  securityHeaders,
  hpp,
  mongoSanitize
};