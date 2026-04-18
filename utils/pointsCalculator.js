const calculatePoints = (data) => {
  let totalPoints = 0;
  const breakdown = {};

  // B.1 Courses Taught (40 points max)
  if (data.courses && data.courses.length > 0) {
    data.courses.forEach(course => {
      // Success Rate: 10 points if >75%, 0 if <=75%
      if (course.success_rate > 75) {
        breakdown.success_rate = 10;
      } else {
        breakdown.success_rate = 0;
      }
      
      // GPA: (GPA/10) * 5
      breakdown.gpa = course.gpa ? (course.gpa / 10) * 5 : 0;
      
      // COs Attained: 1 point per CO
      breakdown.cos_attained = course.cos_attained || 0;
    });

    // B.1 total (2 courses max)
    breakdown.b1_total = Math.min(breakdown.success_rate + breakdown.gpa + breakdown.cos_attained, 40);
    totalPoints += breakdown.b1_total;
  }

  // B.2 Feedback (20 points max)
  if (data.feedback) {
    let feedbackPoints = 0;
    if (data.feedback.odd_feedback >= 75) feedbackPoints += 10;
    if (data.feedback.even_feedback >= 75) feedbackPoints += 10;
    breakdown.feedback = feedbackPoints;
    totalPoints += feedbackPoints;
  }

  // B.3 Pedagogical Initiatives (40 points max)
  if (data.ict_tools) breakdown.b3_ict = (data.ict_tools.length || 0) * 2;
  if (data.assessment_tools) breakdown.b3_assessment = (data.assessment_tools.length || 0) * 2;
  if (data.case_studies) breakdown.b3_cases = (data.case_studies.length || 0) * 2;
  if (data.projects) breakdown.b3_projects = (data.projects.length || 0) * 2;
  if (data.teaching_methods) breakdown.b3_methods = (data.teaching_methods.length || 0) * 2;
  if (data.content_development) breakdown.b3_content = (data.content_development.length || 0) * 5;
  if (data.obe_awareness) breakdown.b3_obe = 4;

  breakdown.b3_total = Math.min(
    (breakdown.b3_ict || 0) +
    (breakdown.b3_assessment || 0) +
    (breakdown.b3_cases || 0) +
    (breakdown.b3_projects || 0) +
    (breakdown.b3_methods || 0) +
    (breakdown.b3_content || 0) +
    (breakdown.b3_obe || 0),
    40
  );
  totalPoints += breakdown.b3_total;

  // B.4 Mentoring (20 points max)
  if (data.mentoring) {
    const m = data.mentoring;
    const N = m.total_students || 1;
    
    breakdown.mentor_cleared_odd = m.cleared_odd ? (m.cleared_odd / N) * 4 : 0;
    breakdown.mentor_cleared_even = m.cleared_even ? (m.cleared_even / N) * 4 : 0;
    breakdown.mentor_events = (m.events_participated || 0) * 0.5;
    breakdown.mentor_awards = (m.awards || 0) * 1;
    breakdown.mentor_nptel = (m.nptel || 0) * 0.5;
    breakdown.mentor_cert = (m.certifications || 0) * 0.5;
    breakdown.mentor_attendance = m.attendance ? (m.attendance / N) * 3 : 0;

    breakdown.b4_total = Math.min(
      breakdown.mentor_cleared_odd +
      breakdown.mentor_cleared_even +
      breakdown.mentor_events +
      breakdown.mentor_awards +
      breakdown.mentor_nptel +
      breakdown.mentor_cert +
      breakdown.mentor_attendance,
      20
    );
    totalPoints += breakdown.b4_total;
  }

  breakdown.total = totalPoints;
  return breakdown;
};

module.exports = { calculatePoints };