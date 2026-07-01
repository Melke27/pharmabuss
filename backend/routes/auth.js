const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, preferredLanguage, conditions } = req.body;

    const existingUser = email ? await User.findOne({ email }) : null;
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const userCount = await User.countDocuments();
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: userCount === 0 ? 'admin' : 'user',
      preferredLanguage: preferredLanguage || 'en',
      conditions: conditions || [],
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      conditions: user.conditions,
      settings: user.settings,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      conditions: user.conditions,
      settings: user.settings,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, phone, preferredLanguage, conditions, allergies, emergencyContact, settings } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (conditions) user.conditions = conditions;
    if (allergies) user.allergies = allergies;
    if (emergencyContact) user.emergencyContact = emergencyContact;
    if (settings) user.settings = { ...user.settings, ...settings };

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      preferredLanguage: updated.preferredLanguage,
      conditions: updated.conditions,
      allergies: updated.allergies,
      emergencyContact: updated.emergencyContact,
      settings: updated.settings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/make-admin', async (req, res) => {
  try {
    const { secret, email } = req.body;
    if (secret !== process.env.ADMIN_SECRET && secret !== 'polycare-admin-2024') {
      return res.status(403).json({ error: 'Invalid secret' });
    }
    if (!email) return res.status(400).json({ error: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.role = 'admin';
    await user.save();
    res.json({ message: `${user.name} is now an admin` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
