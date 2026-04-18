const request = require('supertest');
const express = require('express');
const partDController = require('../src/partD/partD.controller');
const { firestore } = require('../src/config/firebase');

// Mock Auth Middleware
const mockAuth = (req, res, next) => {
  req.user = { uid: 'admin_user', role: 'admin' };
  next();
};

const partDRoutes = require('../src/partD/partD.routes');

const app = express();
app.use(express.json());

// Mount the actual routes to test middlewares (authenticate is mocked in src/middleware/auth.js dev mode usually, 
// but here we want to ensure validateEmployeeExists runs)
// Note: partD.routes.js ALREADY applies authenticate. 
// However, the test script's 'app' doesn't use the real 'authenticate' because of NODE_ENV=development in auth.js.

app.use('/api/partD', partDRoutes);

async function runProductionTestSuite() {
  console.log('\n==========================================');
  console.log('🚀 INITIALIZING FULL PRODUCTION TEST SUITE');
  console.log('==========================================\n');

  const VALID_EMP_ID = 'EMP001';
  const INVALID_EMP_ID = 'NON_EXISTENT_999';
  let passed = 0, failed = 0;

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${message}`);
    } else {
      failed++;
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  try {
    // Stage 1: Validation & Type Safety
    console.log('--- STAGE 1: Validation & Type Safety ---');
    
    // Existence check (RTDB)
    let res = await request(app).get(`/api/partD/${INVALID_EMP_ID}/trainings_attended`);
    assert(res.statusCode === 404 && res.body.error.includes('not found'), 'Non-existent employee ID rejected with 404');

    // Invalid type
    res = await request(app).post(`/api/partD/${VALID_EMP_ID}/invalid_type`).send({ test: 1 });
    assert(res.statusCode === 400 && res.body.error === 'Invalid section type: invalid_type', 'Invalid type blocked by validator');

    // Empty body
    res = await request(app).post(`/api/partD/${VALID_EMP_ID}/trainings_attended`).send({});
    assert(res.statusCode === 400 && res.body.error === 'Empty payload not allowed', 'Empty body blocked');

    // Missing field
    res = await request(app).post(`/api/partD/${VALID_EMP_ID}/trainings_attended`).send({ title: 'Missing Type' });
    assert(res.statusCode === 400 && res.body.error.includes('Missing fields'), 'Missing required fields blocked');

    // Stage 2: Subcollection Integrity (All Array Types)
    console.log('\n--- STAGE 2: subcollection Integrity (Array Types) ---');
    
    const arrayTypes = [
      { type: 'trainings_attended', data: { type: 'FDP', title: 'AI Ethics', duration: '2 days', proof: 'proof_url' } },
      { type: 'workshops', data: { title: 'JS Patterns', duration: '4h', description: 'Advanced JS', proof: 'url' } },
      { type: 'certifications', data: { title: 'AWS Cloud', organization: 'Amazon', description: 'Cert', duration: '5h', proof: 'url' } },
      { type: 'training_conducted', data: { role: 'Resource Person', program_type: 'Seminar', duration: '1h', count: 1, proof: 'url' } },
      { type: 'value_added_courses', data: { title: 'Soft Skills', duration_hours: 10, count: 1, proof: 'url' } },
      { type: 'professional_memberships', data: { society_name: 'IEEE', membership_type: 'Senior', count: 1, proof: 'url' } },
      { type: 'interactions', data: { activity_type: 'Guest Lecture', description: 'Lecture', add_on: 'None', proof: 'url' } },
      { type: 'awards', data: { title: 'Best Teacher', description: 'Awarded for tech', year: 2024, proof: 'url' } }
    ];

    for (const item of arrayTypes) {
      res = await request(app).post(`/api/partD/${VALID_EMP_ID}/${item.type}`).send(item.data);
      assert(res.statusCode === 201 && res.body.created_at && res.body.updated_at, `POST ${item.type}: Success with timestamps`);
      
      const docId = res.body.id;
      
      // Fetch
      res = await request(app).get(`/api/partD/${VALID_EMP_ID}/${item.type}`);
      assert(res.statusCode === 200 && Array.isArray(res.body) && res.body.length > 0, `GET ${item.type}: Returned array correctly`);

      // Delete
      res = await request(app).delete(`/api/partD/${VALID_EMP_ID}/${item.type}/${docId}`);
      assert(res.statusCode === 200, `DELETE ${item.type}/${docId}: Successful cleanup`);
    }

    // Stage 3: Single Field Merge Safety (The 3 Object Types)
    console.log('\n--- STAGE 3: Single Field Merge Safety (Object Types) ---');
    
    const singleFields = [
      { type: 'institution_contribution', data: { description: 'Chairperson', principal_remarks: 'Excellent' } },
      { type: 'department_contribution', data: { description: 'Exam Coordinator', hod_remarks: 'Dependable' } },
      { type: 'additional_info', data: { bio: 'Senior AI Specialist', research_area: 'Generative AI' } }
    ];

    for (const field of singleFields) {
      // Create initial
      res = await request(app).put(`/api/partD/${VALID_EMP_ID}/${field.type}`).send(field.data);
      assert(res.statusCode === 200 && res.body.created_at, `PUT ${field.type}: Created successfully`);

      // Partial Update (Merge Check)
      const updatedData = { ...field.data, [Object.keys(field.data)[0]]: 'Updated Info' };
      res = await request(app).put(`/api/partD/${VALID_EMP_ID}/${field.type}`).send(updatedData);
      
      const fetched = await request(app).get(`/api/partD/${VALID_EMP_ID}/${field.type}`);
      assert(fetched.body[Object.keys(field.data)[1]] === field.data[Object.keys(field.data)[1]], `PUT ${field.type}: Merged successfully without losing other fields`);
      assert(fetched.body.updated_at !== fetched.body.created_at, `PUT ${field.type}: updated_at changed independently`);
    }

    console.log('\n==========================================');
    console.log(`📊 FINAL REPORT: ${passed} PASSED | ${failed} FAILED`);
    console.log('==========================================\n');

  } catch (err) {
    console.error('❌ CRITICAL TEST ERROR:', err);
  } finally {
    process.exit(failed > 0 ? 1 : 0);
  }
}

runProductionTestSuite();
