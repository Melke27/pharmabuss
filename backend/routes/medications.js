const express = require('express');
const Medication = require('../models/Medication');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medication) return res.status(404).json({ error: 'Medication not found' });
    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const medication = await Medication.create({ ...req.body, userId: req.user._id });
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!medication) return res.status(404).json({ error: 'Medication not found' });
    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!medication) return res.status(404).json({ error: 'Medication not found' });
    res.json({ message: 'Medication removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
