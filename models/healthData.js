const mongoose = require('mongoose');

const headlthDataSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  heart_rate :{ type: String },
  SleepData:{type : Array},
});

const HealthData = mongoose.model('HealthData', headlthDataSchema);

module.exports = HealthData;
