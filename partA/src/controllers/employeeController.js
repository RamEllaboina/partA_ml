const Employee = require('../models/Employee');
const User = require('../models/User');

class EmployeeController {
  // Create new employee
  static async createEmployee(req, res) {
    try {
      const { employee_id, user_data, employee_data } = req.body;

      // Check if user already exists
      const existingUser = await User.findById(employee_id);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Employee ID already exists' 
        });
      }

      // Create user first
      await User.create(employee_id, user_data);

      // Create employee
      const employee = await Employee.create(employee_id, employee_data, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee.toJSON()
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  // Get all employees with pagination
  static async getAllEmployees(req, res) {
    try {
      const { limit = 50, start_key } = req.query;
      
      const employees = await Employee.findAll(
        parseInt(limit), 
        start_key
      );

      res.json({
        success: true,
        data: employees.map(emp => emp.toJSON()),
        pagination: {
          limit: parseInt(limit),
          has_more: employees.length === parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  // Get employee by ID
  static async getEmployeeById(req, res) {
    try {
      const { employee_id } = req.params;
      
      const [employee, user] = await Promise.all([
        Employee.findById(employee_id),
        User.findById(employee_id)
      ]);

      if (!employee) {
        return res.status(404).json({ 
          error: 'Employee not found' 
        });
      }

      const employeeData = employee.toJSON();
      if (user) {
        employeeData.user = user.toJSON();
      }

      res.json({
        success: true,
        data: employeeData
      });
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  // Update employee
  static async updateEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      const updateData = req.body;

      const employee = await Employee.findById(employee_id);
      if (!employee) {
        return res.status(404).json({ 
          error: 'Employee not found' 
        });
      }

      await employee.update(updateData);

      res.json({
        success: true,
        message: 'Employee updated successfully',
        data: employee.toJSON()
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  // Delete employee
  static async deleteEmployee(req, res) {
    try {
      const { employee_id } = req.params;

      const employee = await Employee.findById(employee_id);
      if (!employee) {
        return res.status(404).json({ 
          error: 'Employee not found' 
        });
      }

      await employee.delete();

      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  // Get employees by department
  static async getEmployeesByDepartment(req, res) {
    try {
      const { department } = req.params;
      
      const employees = await Employee.findByDepartment(department);

      res.json({
        success: true,
        data: employees.map(emp => emp.toJSON())
      });
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  // Get employees by experience range
  static async getEmployeesByExperience(req, res) {
    try {
      const { min_years, max_years } = req.query;
      
      if (!min_years || !max_years) {
        return res.status(400).json({ 
          error: 'min_years and max_years are required' 
        });
      }

      const employees = await Employee.findByExperienceRange(
        parseFloat(min_years), 
        parseFloat(max_years)
      );

      res.json({
        success: true,
        data: employees.map(emp => emp.toJSON())
      });
    } catch (error) {
      console.error('Error fetching employees by experience:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  // Search employees by name
  static async searchEmployees(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ 
          error: 'Search query is required' 
        });
      }

      const employees = await Employee.searchByName(q);

      res.json({
        success: true,
        data: employees.map(emp => emp.toJSON())
      });
    } catch (error) {
      console.error('Error searching employees:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  // Get employee statistics
  static async getEmployeeStats(req, res) {
    try {
      const { db } = require('../config/firebase');
      
      const [employeesSnapshot, departmentsSnapshot] = await Promise.all([
        db.ref('employees').once('value'),
        db.ref('departments').once('value')
      ]);

      const employees = employeesSnapshot.val() || {};
      const departments = departmentsSnapshot.val() || {};

      const totalEmployees = Object.keys(employees).length;
      const activeEmployees = Object.values(employees).filter(emp => emp).length;

      const departmentStats = {};
      Object.values(employees).forEach(emp => {
        if (emp && emp.department) {
          departmentStats[emp.department] = (departmentStats[emp.department] || 0) + 1;
        }
      });

      const experienceStats = {
        '0-2': 0,
        '2-5': 0,
        '5-10': 0,
        '10+': 0
      };

      Object.values(employees).forEach(emp => {
        if (emp && emp.total_service) {
          const years = emp.total_service;
          if (years < 2) experienceStats['0-2']++;
          else if (years < 5) experienceStats['2-5']++;
          else if (years < 10) experienceStats['5-10']++;
          else experienceStats['10+']++;
        }
      });

      res.json({
        success: true,
        data: {
          total_employees: totalEmployees,
          active_employees: activeEmployees,
          total_departments: Object.keys(departments).length,
          department_distribution: departmentStats,
          experience_distribution: experienceStats
        }
      });
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  }
}

module.exports = EmployeeController;
