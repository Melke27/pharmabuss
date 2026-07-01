const mongoose = require('mongoose');

const mealFoodSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: { type: String, default: 'serving' },
}, { _id: false });

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  name: { type: String, required: true },
  foods: [mealFoodSchema],
  instructions: String,
  date: { type: String, required: true },
  calories: Number,
  consumed: { type: Boolean, default: false },
}, { timestamps: true });

mealSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Diet', mealSchema);
