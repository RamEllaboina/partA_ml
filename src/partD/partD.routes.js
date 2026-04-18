const express = require('express');
const router = express.Router();
const partDController = require('./partD.controller');
const { authenticate, authorize, selfOrAdmin } = require('../middleware/auth');
const { validateEmployeeExists } = require('../middleware/validateEmployee');

// Apply authentication globally to all Part D routes
router.use(authenticate);

// -------------------------------------------------------------
// Admin Only: Create and Delete functionality
// -------------------------------------------------------------
router.post('/:employee_id/:type', authorize(['admin']), validateEmployeeExists, partDController.createRecord);
router.delete('/:employee_id/:type/:docId', authorize(['admin']), validateEmployeeExists, partDController.deleteRecord);
router.delete('/:employee_id/:type', authorize(['admin']), validateEmployeeExists, partDController.deleteRecord);

// -------------------------------------------------------------
// Self Or Admin: Read and Update functionality
// Ensures employees edit their own scope via employee_id constraints
// -------------------------------------------------------------
router.get('/:employee_id/:type', selfOrAdmin, validateEmployeeExists, partDController.getRecords);
router.put('/:employee_id/:type/:docId', selfOrAdmin, validateEmployeeExists, partDController.updateRecord);
router.put('/:employee_id/:type', selfOrAdmin, validateEmployeeExists, partDController.updateRecord);

module.exports = router;
