const admin = require('firebase-admin');
const partDService = require('../src/partD/partD.service');
const { firestore } = require('../src/config/firebase');

async function seedData() {
  console.log('--- Starting Firestore Data Seeding ---');
  const employeeId = 'EMP_FINAL_READY';

  try {
    // Check if trainings already exist to avoid duplication
    const existingTrainings = await partDService.getFromSubcollection(employeeId, 'trainings_attended');
    if (existingTrainings.length > 0) {
      console.log('Skipping seed: Data already exists for EMP001');
      return;
    }

    console.log(`Inserting dummy data for ${employeeId}...`);

    // 1. Trainings (2 records)
    await partDService.addToSubcollection(employeeId, 'trainings_attended', {
      type: 'Technical',
      title: 'Advanced React Patterns',
      duration: '10 hours',
      proof: 'react_cert.pdf'
    });
    console.log('Added training 1');

    await partDService.addToSubcollection(employeeId, 'trainings_attended', {
      type: 'Security',
      title: 'Cloud Security Fundamentals',
      duration: '5 hours',
      proof: 'sec_cert.pdf'
    });
    console.log('Added training 2');

    // 2. Workshops (1 record)
    await partDService.addToSubcollection(employeeId, 'workshops', {
      title: 'Agile Leadership',
      duration: '4 hours',
      description: 'Workshop on agile management',
      proof: 'cert_123.pdf'
    });
    console.log('Added workshop');

    // 3. Certifications (1 record)
    await partDService.addToSubcollection(employeeId, 'certifications', {
      title: 'AWS Solutions Architect',
      organization: 'Amazon',
      description: 'Cloud certification',
      duration: '6 months',
      proof: 'aws_cert.pdf'
    });
    console.log('Added certification');

    // 4. Training Conducted (1 record)
    await partDService.addToSubcollection(employeeId, 'training_conducted', {
      role: 'Instructor',
      program_type: 'FDP',
      duration: '1 week',
      count: 1,
      proof: 'fdp_cert.pdf'
    });
    console.log('Added training conducted');

    // 5. Value Added Courses (1 record)
    await partDService.addToSubcollection(employeeId, 'value_added_courses', {
      title: 'Ethical Hacking',
      duration_hours: 30,
      count: 1,
      proof: 'hack_cert.pdf'
    });
    console.log('Added value added course');

    // 6. Professional Memberships (1 record)
    await partDService.addToSubcollection(employeeId, 'professional_memberships', {
      society_name: 'IEEE',
      membership_type: 'Senior Member',
      count: 1,
      proof: 'ieee_card.pdf'
    });
    console.log('Added membership');

    // 7. Interactions (1 record)
    await partDService.addToSubcollection(employeeId, 'interactions', {
      activity_type: 'Guest Lecture',
      description: 'Delivered lecture on AI',
      add_on: 'Token of appreciation',
      proof: 'lecture_letter.pdf'
    });
    console.log('Added interaction');

    // 8. Awards (1 record)
    await partDService.addToSubcollection(employeeId, 'awards', {
      title: 'Employee of the Month',
      description: 'For outstanding performance',
      year: 2025,
      proof: 'award_cert.pdf'
    });
    console.log('Added award');

    // 6. Additional Info (merged field)
    await partDService.setSingleField(employeeId, 'additional_info', {
      bio: 'Senior faculty in AI',
      research_area: 'Machine Learning'
    });
    console.log('Added additional_info (Part E)');

    // 7. Institution Contribution (merged field)
    await partDService.setSingleField(employeeId, 'institution_contribution', {
      description: 'Member of admission committee',
      principal_remarks: 'Excellent work'
    });
    console.log('Added institution_contribution');

    // 11. Department Contribution (merged field)
    await partDService.setSingleField(employeeId, 'department_contribution', {
      description: 'Lab Incharge',
      hod_remarks: 'Outstanding'
    });
    console.log('Added department_contribution');

    console.log('\\n--- Seeding Completed Successfully ---');

    // Verification step
    const finalData = await partDService.getSingleField(employeeId, 'additional_info');
    console.log('\\nVerification: additional_info fields:', finalData);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seedData();
