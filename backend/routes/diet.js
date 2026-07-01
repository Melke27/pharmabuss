const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { date, startDate, endDate, type } = req.query;
    const query = { userId: req.user._id };
    if (date) query.date = date;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    const meals = await Diet.find(query).sort({ date: -1, createdAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, name, foods, instructions, date, calories } = req.body;
    const meal = await Diet.create({ userId: req.user._id, type, name, foods, instructions, date, calories });
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const meal = await Diet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const meal = await Diet.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
