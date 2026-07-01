const express = require('express');
const Consultation = require('../models/Consultation');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.user._id }).sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const consultation = await Consultation.create({ ...req.body, patientId: req.user._id });
    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/messages', async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ _id: req.params.id, patientId: req.user._id });
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    consultation.messages.push({ ...req.body, senderId: req.user._id, senderType: 'patient' });
    consultation.status = 'active';
    await consultation.save();

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      req.body,
      { new: true }
    );
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/pharmacists', async (req, res) => {
  const pharmacists = [
    { id: 'pharm-1', name: 'Dr. Abebe Kebede', licenseNumber: 'ETH-PHARM-001', specialization: 'Clinical Pharmacy', rating: 4.8, available: true },
    { id: 'pharm-2', name: 'Dr. Almaz Haile', licenseNumber: 'ETH-PHARM-002', specialization: 'Pharmacotherapy', rating: 4.7, available: true },
    { id: 'pharm-3', name: 'Dr. Dawit Tadesse', licenseNumber: 'ETH-PHARM-003', specialization: 'Medication Safety', rating: 4.9, available: false },
  ];
  res.json(pharmacists);
});

module.exports = router;
