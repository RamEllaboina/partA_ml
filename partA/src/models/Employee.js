const { db } = require('../config/firebase');
const Joi = require('joi');

const employeeCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  department: Joi.string().min(2).max(50).required(),
  designation: Joi.string().min(2).max(50).required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  qualification: Joi.string().min(2).max(100).required(),
  joining_date: Joi.date().required(),
  total_service: Joi.number().min(0).default(0),
  cbit_experience: Joi.number().min(0).default(0)
});

const employeeUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  department: Joi.string().min(2).max(50).optional(),
  designation: Joi.string().min(2).max(50).optional(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  qualification: Joi.string().min(2).max(100).optional(),
  joining_date: Joi.date().optional(),
  total_service: Joi.number().min(0).optional(),
  cbit_experience: Joi.number().min(0).optional()
});

class Employee {
  constructor(data) {
    this.employee_id = data.employee_id;
    this.name = data.name;
    this.department = data.department;
    this.designation = data.designation;
    this.mobile = data.mobile;
    this.qualification = data.qualification;
    this.joining_date = data.joining_date;
    this.total_service = data.total_service || 0;
    this.cbit_experience = data.cbit_experience || 0;
    this.created_at = data.created_at || Date.now();
    this.updated_at = data.updated_at || Date.now();
    this.created_by = data.created_by;
  }

  static async create(employeeId, employeeData, createdBy) {
    const validation = employeeCreateSchema.validate(employeeData);
    if (validation.error) {
      throw new Error(`Validation error: ${validation.error.details[0].message}`);
    }

    const timestamp = Date.now();
    const employee = new Employee({
      ...employeeData,
      employee_id: employeeId,
      joining_date: new Date(employeeData.joining_date).getTime(),
      created_by: createdBy,
      created_at: timestamp,
      updated_at: timestamp
    });

    await db.ref(`employees/${employeeId}`).set(employee.toJSON());
    
    // Update department count
    await db.ref(`departments/${employeeData.department}/employee_count`)
      .transaction(currentCount => (currentCount || 0) + 1);

    return employee;
  }

  static async findById(employeeId) {
    const snapshot = await db.ref(`employees/${employeeId}`).once('value');
    const data = snapshot.val();
    
    if (!data) return null;
    
    return new Employee({ ...data, employee_id: employeeId });
  }

  static async findByDepartment(department) {
    const snapshot = await db.ref('employees')
      .orderByChild('department')
      .equalTo(department)
      .once('value');
    
    const employees = snapshot.val() || {};
    return Object.keys(employees).map(id => 
      new Employee({ ...employees[id], employee_id: id })
    );
  }

  static async findByExperienceRange(minYears, maxYears) {
    const snapshot = await db.ref('employees')
      .orderByChild('total_service')
      .startAt(minYears)
      .endAt(maxYears)
      .once('value');
    
    const employees = snapshot.val() || {};
    return Object.keys(employees).map(id => 
      new Employee({ ...employees[id], employee_id: id })
    );
  }

  static async findAll(limit = 50, startKey = null) {
    let query = db.ref('employees')
      .orderByChild('name')
      .limitToFirst(limit);
    
    if (startKey) {
      query = query.startAt(startKey);
    }
    
    const snapshot = await query.once('value');
    const employees = snapshot.val() || {};
    
    return Object.keys(employees).map(id => 
      new Employee({ ...employees[id], employee_id: id })
    );
  }

  async update(updateData) {
    const validation = employeeUpdateSchema.validate(updateData);
    if (validation.error) {
      throw new Error(`Validation error: ${validation.error.details[0].message}`);
    }

    const updates = {
      ...updateData,
      updated_at: Date.now()
    };

    if (updateData.joining_date) {
      updates.joining_date = new Date(updateData.joining_date).getTime();
    }

    await db.ref(`employees/${this.employee_id}`).update(updates);
    
    // Update local instance
    Object.assign(this, updates);
    
    return this;
  }

  async delete() {
    // Get department before deletion
    const employee = await Employee.findById(this.employee_id);
    
    if (employee) {
      // Delete employee
      await db.ref(`employees/${this.employee_id}`).remove();
      
      // Update department count
      await db.ref(`departments/${employee.department}/employee_count`)
        .transaction(currentCount => Math.max(0, (currentCount || 0) - 1));
      
      // Also delete user record
      await db.ref(`users/${this.employee_id}`).remove();
    }
  }

  static async searchByName(searchTerm) {
    const snapshot = await db.ref('employees')
      .orderByChild('name')
      .startAt(searchTerm)
      .endAt(searchTerm + '\uf8ff')
      .once('value');
    
    const employees = snapshot.val() || {};
    return Object.keys(employees).map(id => 
      new Employee({ ...employees[id], employee_id: id })
    );
  }

  toJSON() {
    return {
      employee_id: this.employee_id,
      name: this.name,
      department: this.department,
      designation: this.designation,
      mobile: this.mobile,
      qualification: this.qualification,
      joining_date: this.joining_date,
      total_service: this.total_service,
      cbit_experience: this.cbit_experience,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by
    };
  }
}

module.exports = Employee;
