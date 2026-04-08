const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Calculate total_service when employee is created or updated
exports.calculateTotalService = functions.database
  .ref('/employees/{employeeId}')
  .onWrite(async (change, context) => {
    const employeeData = change.after.val();
    
    if (!employeeData) return null; // Employee deleted
    
    const joiningDate = employeeData.joining_date;
    const currentDate = Date.now();
    
    // Calculate service in years
    const totalService = (currentDate - joiningDate) / (1000 * 60 * 60 * 24 * 365);
    
    // Update only if total_service is significantly different
    if (Math.abs(totalService - employeeData.total_service) > 0.01) {
      return change.after.ref.update({
        total_service: Math.round(totalService * 100) / 100,
        updated_at: admin.database.ServerValue.TIMESTAMP
      });
    }
    
    return null;
  });

// Validate employee data before write
exports.validateEmployeeData = functions.database
  .ref('/employees/{employeeId}')
  .onCreate(async (snapshot, context) => {
    const employeeData = snapshot.val();
    const employeeId = context.params.employeeId;
    
    // Check if user exists
    const userSnapshot = await admin.database()
      .ref(`/users/${employeeId}`)
      .once('value');
    
    if (!userSnapshot.exists()) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Employee ID must exist in users collection'
      );
    }
    
    // Validate mobile format
    if (!/^[0-9]{10}$/.test(employeeData.mobile)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Mobile number must be exactly 10 digits'
      );
    }
    
    // Update department employee count
    await admin.database()
      .ref(`/departments/${employeeData.department}/employee_count`)
      .transaction(currentCount => (currentCount || 0) + 1);
    
    return null;
  });

// Audit trail for employee updates
exports.auditEmployeeChanges = functions.database
  .ref('/employees/{employeeId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.val();
    const afterData = change.after.val();
    const employeeId = context.params.employeeId;
    
    const auditLog = {
      employee_id: employeeId,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      changed_by: context.auth ? context.auth.uid : 'system',
      changes: {}
    };
    
    // Track changes
    Object.keys(afterData).forEach(key => {
      if (beforeData[key] !== afterData[key]) {
        auditLog.changes[key] = {
          from: beforeData[key],
          to: afterData[key]
        };
      }
    });
    
    // Only log if there are actual changes
    if (Object.keys(auditLog.changes).length > 0) {
      await admin.database()
        .ref(`/audit_logs/${employeeId}`)
        .push(auditLog);
    }
    
    return null;
  });

// Update department count when employee is deleted
exports.updateDepartmentCountOnDelete = functions.database
  .ref('/employees/{employeeId}')
  .onDelete(async (snapshot, context) => {
    const employeeData = snapshot.val();
    
    if (employeeData && employeeData.department) {
      await admin.database()
        .ref(`/departments/${employeeData.department}/employee_count`)
        .transaction(currentCount => Math.max(0, (currentCount || 0) - 1));
    }
    
    return null;
  });

// Generate employee statistics
exports.generateEmployeeStats = functions.https.onRequest(async (req, res) => {
  try {
    const [employeesSnapshot, departmentsSnapshot] = await Promise.all([
      admin.database().ref('employees').once('value'),
      admin.database().ref('departments').once('value')
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

    const stats = {
      total_employees: totalEmployees,
      active_employees: activeEmployees,
      total_departments: Object.keys(departments).length,
      department_distribution: departmentStats,
      experience_distribution: experienceStats,
      generated_at: admin.database.ServerValue.TIMESTAMP
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send welcome email to new employees
exports.sendWelcomeEmail = functions.database
  .ref('/employees/{employeeId}')
  .onCreate(async (snapshot, context) => {
    const employeeData = snapshot.val();
    const employeeId = context.params.employeeId;
    
    // Get user data
    const userSnapshot = await admin.database()
      .ref(`/users/${employeeId}`)
      .once('value');
    
    const userData = userSnapshot.val();
    
    if (userData && userData.email) {
      // Here you would integrate with an email service like SendGrid, Mailgun, etc.
      console.log(`Welcome email sent to ${userData.email} for employee ${employeeData.name}`);
      
      // Log the email sent
      await admin.database()
        .ref(`/email_logs/${employeeId}`)
        .push({
          type: 'welcome',
          email: userData.email,
          employee_name: employeeData.name,
          sent_at: admin.database.ServerValue.TIMESTAMP
        });
    }
    
    return null;
  });
