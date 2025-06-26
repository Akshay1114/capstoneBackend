// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const bloodPressureSchema = new mongoose.Schema({
  userID: { type: String },
  datetime: { type: String },
  diastolic: { type: String },
  status :{ type: String },
  systolic:{type : String},
  userID: {
    type: String, // ✅ Accept string ID
    required: true,
  },
});

const BloodPressure = mongoose.model('BloodPressure', bloodPressureSchema);

export {BloodPressure};