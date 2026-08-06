const express = require('express');
const { db, admin } = require('../config/firebase');
const { validatePartB } = require('../middleware/validation');

const router = express.Router();

const COLLECTION = 'part_b';

router.post('/', validatePartB, async (req, res) => {
  try {
    const {
      employee_id,
      courses,
      feedback,
      ict_tools,
      assessment_tools,
      case_studies,
      projects,
      teaching_methods,
      content_development,
      obe_awareness,
      mentoring
    } = req.body;

    const docRef = db.collection(COLLECTION).doc(employee_id);
    await docRef.set({
      employee_id,
      courses: courses || null,
      feedback: feedback || null,
      ict_tools: ict_tools || [],
      assessment_tools: assessment_tools || [],
      case_studies: case_studies || [],
      projects: projects || [],
      teaching_methods: teaching_methods || [],
      content_development: content_development || [],
      obe_awareness: obe_awareness || null,
      mentoring: mentoring || null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.status(201).json({ message: 'Part B data saved successfully', employee_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:employee_id', async (req, res) => {
  try {
    const { employee_id } = req.params;
    const docRef = db.collection(COLLECTION).doc(employee_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Part B data not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:employee_id', validatePartB, async (req, res) => {
  try {
    const { employee_id } = req.params;
    const {
      courses,
      feedback,
      ict_tools,
      assessment_tools,
      case_studies,
      projects,
      teaching_methods,
      content_development,
      obe_awareness,
      mentoring
    } = req.body;

    const docRef = db.collection(COLLECTION).doc(employee_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Part B data not found' });
    }

    const existing = doc.data();

    await docRef.update({
      courses: courses || existing.courses,
      feedback: feedback || existing.feedback,
      ict_tools: ict_tools || existing.ict_tools,
      assessment_tools: assessment_tools || existing.assessment_tools,
      case_studies: case_studies || existing.case_studies,
      projects: projects || existing.projects,
      teaching_methods: teaching_methods || existing.teaching_methods,
      content_development: content_development || existing.content_development,
      obe_awareness: obe_awareness || existing.obe_awareness,
      mentoring: mentoring || existing.mentoring,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: 'Part B data updated successfully', employee_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).get();
    const documents = [];

    snapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:employee_id', async (req, res) => {
  try {
    const { employee_id } = req.params;
    const docRef = db.collection(COLLECTION).doc(employee_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Part B data not found' });
    }

    await docRef.delete();
    res.status(200).json({ message: 'Part B data deleted successfully', employee_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;