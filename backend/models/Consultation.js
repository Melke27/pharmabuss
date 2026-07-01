const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderType: { type: String, enum: ['patient', 'pharmacist'], required: true },
  type: { type: String, enum: ['text', 'image', 'audio', 'system'], default: 'text' },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const consultationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacistId: { type: String, required: true },
  type: { type: String, enum: ['chat', 'video', 'audio'], required: true },
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
  subject: String,
  scheduledDate: String,
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
