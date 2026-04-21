const { auth } = require('../config/firebase');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Demo mode - allow requests without token for testing
    if (process.env.NODE_ENV === 'development') {
      // Mock admin user for demo purposes
      req.user = {
        id: 'EMP002',
        email: 'jane.smith@company.com',
        role: 'admin'
      };
      return next();
    }

    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const user = await User.findById(decodedToken.uid);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ 
        error: 'Invalid or inactive user' 
      });
    }

    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    if (roles && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

const selfOrAdmin = (req, res, next) => {
  const { employee_id } = req.params;
  
  if (req.user.role === 'admin' || req.user.id === employee_id) {
    return next();
  }
  
  res.status(403).json({ 
    error: 'Access denied' 
  });
};

module.exports = {
  authenticate,
  authorize,
  selfOrAdmin
};
