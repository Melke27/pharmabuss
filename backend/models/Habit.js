const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['habit', 'goal'], default: 'habit' },
  streak: { type: Number, default: 0 },
  doneToday: { type: Boolean, default: false },
  target: Number,
  unit: String,
  current: Number,
  lastCompletedDate: String,
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
