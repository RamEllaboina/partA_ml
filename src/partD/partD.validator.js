// Validator logic for Part D and E Schema
const SINGLE_OBJECT_FIELDS = [
  'institution_contribution', 
  'department_contribution', 
  'additional_info'
];

const schemas = {
  trainings_attended: ['type', 'title', 'duration', 'proof'],
  workshops: ['title', 'duration', 'description', 'proof'],
  certifications: ['title', 'organization', 'description', 'duration', 'proof'],
  training_conducted: ['role', 'program_type', 'duration', 'count', 'proof'],
  value_added_courses: ['title', 'duration_hours', 'count', 'proof'],
  professional_memberships: ['society_name', 'membership_type', 'count', 'proof'],
  interactions: ['activity_type', 'description', 'add_on', 'proof'],
  awards: ['title', 'description', 'year', 'proof'],
  institution_contribution: ['description', 'principal_remarks'],
  department_contribution: ['description', 'hod_remarks'],
  additional_info: ['bio', 'research_area']
};

function validatePayload(type, data) {
  if (typeof data !== 'object') return "Invalid payload format";
  if (!data || Object.keys(data).length === 0) return "Empty payload not allowed";

  const schema = schemas[type];
  if (!schema) {
    return `Invalid section type: ${type}`;
  }
  
  const missing = schema.filter(f => data[f] === undefined || data[f] === null || data[f] === '');
  if (missing.length) return `Missing fields: ${missing.join(', ')}`;
  
  return null;
}

module.exports = {
  SINGLE_OBJECT_FIELDS,
  validatePayload
};
