const mongoose = require('mongoose');

const MotionCounteSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  heart_rate :{ type: String },
  SleepData:{type : Array},
});

const MotionCount = mongoose.model('MotionCount', MotionCounteSchema);

module.exports = MotionCount;
