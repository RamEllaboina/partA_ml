const express = require('express');
const { db, admin } = require('../config/firebase');
const { validatePartC } = require('../middleware/validation');

const router = express.Router();

const COLLECTION = 'part_c';

router.post('/', validatePartC, async (req, res) => {
  try {
    const {
      employee_id,
      conferences,
      journals,
      citations,
      book_chapters,
      textbooks,
      research_projects,
      project_outcomes,
      products,
      patents,
      patent_revenue,
      startups,
      consultancy,
      phd_supervision,
      student_projects
    } = req.body;

    const docRef = db.collection(COLLECTION).doc(employee_id);
    await docRef.set({
      employee_id,
      conferences: conferences || null,
      journals: journals || null,
      citations: citations || null,
      book_chapters: book_chapters || null,
      textbooks: textbooks || null,
      research_projects: research_projects || null,
      project_outcomes: project_outcomes || null,
      products: products || null,
      patents: patents || null,
      patent_revenue: patent_revenue || null,
      startups: startups || null,
      consultancy: consultancy || null,
      phd_supervision: phd_supervision || null,
      student_projects: student_projects || null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.status(201).json({ message: 'Part C data saved successfully', employee_id });
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
      return res.status(404).json({ error: 'Part C data not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:employee_id', validatePartC, async (req, res) => {
  try {
    const { employee_id } = req.params;
    const {
      conferences,
      journals,
      citations,
      book_chapters,
      textbooks,
      research_projects,
      project_outcomes,
      products,
      patents,
      patent_revenue,
      startups,
      consultancy,
      phd_supervision,
      student_projects
    } = req.body;

    const docRef = db.collection(COLLECTION).doc(employee_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Part C data not found' });
    }

    const existing = doc.data();

    await docRef.update({
      conferences: conferences || existing.conferences,
      journals: journals || existing.journals,
      citations: citations || existing.citations,
      book_chapters: book_chapters || existing.book_chapters,
      textbooks: textbooks || existing.textbooks,
      research_projects: research_projects || existing.research_projects,
      project_outcomes: project_outcomes || existing.project_outcomes,
      products: products || existing.products,
      patents: patents || existing.patents,
      patent_revenue: patent_revenue || existing.patent_revenue,
      startups: startups || existing.startups,
      consultancy: consultancy || existing.consultancy,
      phd_supervision: phd_supervision || existing.phd_supervision,
      student_projects: student_projects || existing.student_projects,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: 'Part C data updated successfully', employee_id });
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
      return res.status(404).json({ error: 'Part C data not found' });
    }

    await docRef.delete();
    res.status(200).json({ message: 'Part C data deleted successfully', employee_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;