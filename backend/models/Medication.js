const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  genericName: String,
  dosage: { type: Number, required: true },
  unit: { type: String, enum: ['mg', 'g', 'mcg', 'ml', 'units', 'tablet', 'capsule'], required: true },
  frequency: { type: String, required: true },
  instructions: String,
  startDate: { type: String, required: true },
  endDate: String,
  status: { type: String, enum: ['active', 'discontinued', 'completed'], default: 'active' },
  prescribedBy: String,
  notes: String,
  refillDate: String,
  currentStock: Number,
}, { timestamps: true });

module.exports = mongoose.model('Medication', medicationSchema);
