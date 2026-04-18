const { db } = require('../config/firebase');

/**
 * Middleware to verify that the employee_id exists in the Realtime Database (RTDB)
 * users node before proceeding with Firestore operations.
 */
const validateEmployeeExists = async (req, res, next) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Check RTDB users node
    const snapshot = await db.ref(`users/${employee_id}`).once('value');
    
    if (!snapshot.exists()) {
      return res.status(404).json({ 
        error: `Employee with ID ${employee_id} not found in database` 
      });
    }

    // Move to next middleware or controller
    next();
  } catch (error) {
    console.error('RTDB Existence Check Error:', error);
    res.status(500).json({ error: 'Internal server error during employee validation' });
  }
};

module.exports = {
  validateEmployeeExists
};
