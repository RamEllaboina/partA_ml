const partDService = require('./partD.service');
const { SINGLE_OBJECT_FIELDS, validatePayload } = require('./partD.validator');

class PartDController {
  async createRecord(req, res) {
    try {
      const { employee_id, type } = req.params;
      console.log(`[Part D/E] CREATE Record - EMP: ${employee_id}, TYPE: ${type}`);

      const validationError = validatePayload(type, req.body);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      if (SINGLE_OBJECT_FIELDS.includes(type)) {
        const result = await partDService.setSingleField(employee_id, type, req.body);
        return res.status(200).json(result);
      }

      const result = await partDService.addToSubcollection(employee_id, type, req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating record:', error);
      const statusCode = error.message.includes('Invalid subcollection') ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async getRecords(req, res) {
    try {
      const { employee_id, type } = req.params;
      console.log(`[Part D/E] GET Records - EMP: ${employee_id}, TYPE: ${type}`);

      if (SINGLE_OBJECT_FIELDS.includes(type)) {
        const result = await partDService.getSingleField(employee_id, type);
        return res.status(200).json(result);
      }

      const result = await partDService.getFromSubcollection(employee_id, type);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting records:', error);
      const statusCode = error.message.includes('Invalid subcollection') ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async updateRecord(req, res) {
    try {
      const { employee_id, type, docId } = req.params;
      console.log(`[Part D/E] UPDATE Record - EMP: ${employee_id}, TYPE: ${type}, DOC: ${docId || 'N/A'}`);

      const validationError = validatePayload(type, req.body);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      if (SINGLE_OBJECT_FIELDS.includes(type)) {
        const result = await partDService.setSingleField(employee_id, type, req.body);
        return res.status(200).json(result);
      }

      const result = await partDService.updateInSubcollection(employee_id, type, docId, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error updating record:', error);
      const statusCode = error.message.includes('Invalid subcollection') ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async deleteRecord(req, res) {
    try {
      const { employee_id, type, docId } = req.params;
      console.log(`[Part D/E] DELETE Record - EMP: ${employee_id}, TYPE: ${type}, DOC: ${docId || 'N/A'}`);

      if (SINGLE_OBJECT_FIELDS.includes(type)) {
        const result = await partDService.deleteSingleField(employee_id, type);
        return res.status(200).json(result);
      }

      const result = await partDService.deleteFromSubcollection(employee_id, type, docId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting record:', error);
      const statusCode = error.message.includes('Invalid subcollection') ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

module.exports = new PartDController();
