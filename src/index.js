require('dotenv').config();
const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Firebase Employee Management API'
  });
});

// API Routes
app.use('/api/employees', employeeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Firebase Employee Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      employees: '/api/employees',
      documentation: '/api/docs'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Firebase Employee Management API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
});

module.exports = app;
