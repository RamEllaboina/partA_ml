const { firestore } = require('../config/firebase');
const admin = require('firebase-admin');

class PartDService {
  async addToSubcollection(employee_id, type, data) {
    const timestamp = new Date().toISOString();
    data.created_at = timestamp;
    data.updated_at = timestamp;
    
    const docRef = await firestore
      .collection('employeeProfiles')
      .doc(employee_id)
      .collection(type)
      .add(data);
      
    return { id: docRef.id, ...data };
  }

  async getFromSubcollection(employee_id, type) {
    const snapshot = await firestore
      .collection('employeeProfiles')
      .doc(employee_id)
      .collection(type)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateInSubcollection(employee_id, type, docId, data) {
    data.updated_at = new Date().toISOString();
    
    await firestore
      .collection('employeeProfiles')
      .doc(employee_id)
      .collection(type)
      .doc(docId)
      .update(data);
      
    return { id: docId, ...data };
  }

  async deleteFromSubcollection(employee_id, type, docId) {
    await firestore
      .collection('employeeProfiles')
      .doc(employee_id)
      .collection(type)
      .doc(docId)
      .delete();
      
    return { id: docId, deleted: true };
  }

  // -------------------------------------------------------------
  // Part E and Part D single object logic
  // -------------------------------------------------------------
  async setSingleField(employee_id, type, data) {
    const docRef = await firestore.collection('employeeProfiles').doc(employee_id).get();
    let existingData = {};
    const timestamp = new Date().toISOString();

    if (docRef.exists && docRef.data()[type]) {
      existingData = docRef.data()[type];
    } else {
      data.created_at = timestamp; // Seed creation stamp on first initialization
    }

    data.updated_at = timestamp;
    const mergedData = { ...existingData, ...data };

    await firestore.collection('employeeProfiles').doc(employee_id).set({ [type]: mergedData }, { merge: true });
    return mergedData;
  }

  async getSingleField(employee_id, type) {
    const docRef = await firestore.collection('employeeProfiles').doc(employee_id).get();
    return docRef.exists ? (docRef.data()[type] || {}) : {};
  }

  async deleteSingleField(employee_id, type) {
    await firestore.collection('employeeProfiles').doc(employee_id).set({ 
      [type]: admin.firestore.FieldValue.delete() 
    }, { merge: true });
    return { deleted: true };
  }
}

module.exports = new PartDService();
