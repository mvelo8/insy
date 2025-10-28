// Simple auth middleware without JWT for now
const authMiddleware = (req, res, next) => {
  // For development - always pass authentication
  req.user = {
    id: 1,
    email: 'admin@ipp.com',
    name: 'Admin User',
    role: 'admin'
  };
  next();
};

const optionalAuth = (req, res, next) => {
  req.user = {
    id: 1,
    email: 'admin@ipp.com', 
    name: 'Admin User',
    role: 'admin'
  };
  next();
};

// Mock users
const users = [
  {
    id: 1,
    email: 'admin@ipp.com',
    password: 'password', // plain text for development
    name: 'Admin User',
    role: 'admin'
  }
];

module.exports = { authMiddleware, optionalAuth, users };
