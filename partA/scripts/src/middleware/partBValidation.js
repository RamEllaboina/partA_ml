const validatePartB = (req, res, next) => {
  const errors = [];

  if (!req.body.employee_id) {
    errors.push('employee_id is required');
  }

  if (req.body.courses) {
    req.body.courses.forEach((course, index) => {
      if (!course.semester) errors.push(`courses[${index}].semester is required`);
      if (!course.course_title) errors.push(`courses[${index}].course_title is required`);
      if (course.success_rate !== undefined && (course.success_rate < 0 || course.success_rate > 100)) {
        errors.push(`courses[${index}].success_rate must be between 0-100`);
      }
      if (course.gpa !== undefined && (course.gpa < 0 || course.gpa > 10)) {
        errors.push(`courses[${index}].gpa must be between 0-10`);
      }
      if (course.cos_attained !== undefined && course.cos_attained < 0) {
        errors.push(`courses[${index}].cos_attained must be >= 0`);
      }
    });
  }

  if (req.body.feedback) {
    if (req.body.feedback.odd_feedback !== undefined && (req.body.feedback.odd_feedback < 0 || req.body.feedback.odd_feedback > 100)) {
      errors.push('odd_feedback must be between 0-100');
    }
    if (req.body.feedback.even_feedback !== undefined && (req.body.feedback.even_feedback < 0 || req.body.feedback.even_feedback > 100)) {
      errors.push('even_feedback must be between 0-100');
    }
  }

  if (req.body.mentoring) {
    const m = req.body.mentoring;
    if (m.total_students !== undefined && m.total_students < 0) {
      errors.push('total_students must be >= 0');
    }
    if (m.cleared_odd !== undefined && m.cleared_even !== undefined && m.total_students) {
      if (m.cleared_odd > m.total_students) errors.push('cleared_odd cannot exceed total_students');
      if (m.cleared_even > m.total_students) errors.push('cleared_even cannot exceed total_students');
    }
    if (m.attendance !== undefined && m.total_students) {
      if (m.attendance > m.total_students) errors.push('attendance cannot exceed total_students');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validatePartB };
