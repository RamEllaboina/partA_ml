const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const { authenticate, authorize, selfOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create employee - Admin only
router.post('/', 
  authorize(['admin']), 
  EmployeeController.createEmployee
);

// Get all employees - Admin only
router.get('/', 
  authorize(['admin']), 
  EmployeeController.getAllEmployees
);

// Search employees - Admin only
router.get('/search', 
  authorize(['admin']), 
  EmployeeController.searchEmployees
);

// Get employee statistics - Admin only
router.get('/stats', 
  authorize(['admin']), 
  EmployeeController.getEmployeeStats
);

// Get employees by department - Admin only
router.get('/department/:department', 
  authorize(['admin']), 
  EmployeeController.getEmployeesByDepartment
);

// Get employees by experience range - Admin only
router.get('/experience', 
  authorize(['admin']), 
  EmployeeController.getEmployeesByExperience
);

// Get employee by ID - Self or Admin
router.get('/:employee_id', 
  selfOrAdmin, 
  EmployeeController.getEmployeeById
);

// Update employee - Self or Admin
router.put('/:employee_id', 
  selfOrAdmin, 
  EmployeeController.updateEmployee
);

// Delete employee - Admin only
router.delete('/:employee_id', 
  authorize(['admin']), 
  EmployeeController.deleteEmployee
);

module.exports = router;
