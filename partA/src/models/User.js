const { db, auth } = require('../config/firebase');
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'employee').required(),
  is_active: Joi.boolean().default(true)
});

class User {
  constructor(data) {
    this.employee_id = data.employee_id;
    this.email = data.email;
    this.role = data.role;
    this.is_active = data.is_active !== false;
    this.created_at = data.created_at || Date.now();
    this.last_login = data.last_login || null;
  }

  static async create(employeeId, userData) {
    const validation = userSchema.validate(userData);
    if (validation.error) {
      throw new Error(`Validation error: ${validation.error.details[0].message}`);
    }

    const user = new User({
      ...userData,
      employee_id: employeeId,
      created_at: Date.now(),
      last_login: userData.last_login || null
    });

    await db.ref(`users/${employeeId}`).set(user.toJSON());
    return user;
  }

  static async findById(employeeId) {
    const snapshot = await db.ref(`users/${employeeId}`).once('value');
    const data = snapshot.val();

    if (!data) return null;

    return new User({ ...data, employee_id: employeeId });
  }

  async update(updateData) {
    const validation = userSchema.validate(updateData, { allowUnknown: true });
    if (validation.error) {
      throw new Error(`Validation error: ${validation.error.details[0].message}`);
    }

    const updates = {
      ...updateData,
      updated_at: Date.now()
    };

    await db.ref(`users/${this.employee_id}`).update(updates);

    // Update local instance
    Object.assign(this, updates);

    return this;
  }

  toJSON() {
    return {
      employee_id: this.employee_id,
      email: this.email,
      role: this.role,
      is_active: this.is_active,
      created_at: this.created_at,
      last_login: this.last_login
    };
  }
}

module.exports = User;
