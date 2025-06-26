// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const bloodPressureSchema = new mongoose.Schema({
  userID: { type: String },
  datetime: { type: String },
  diastolic: { type: String },
  status :{ type: String },
  systolic:{type : String},
});

const BloodPressure = mongoose.model('BloodPressure', bloodPressureSchema);

export {BloodPressure};