const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
  title: { type: String, required: true },
  time: { type: String, required: true },
  days: [{ type: Number }],
  enabled: { type: Boolean, default: true },
  lastTaken: String,
  snoozedUntil: String,
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
