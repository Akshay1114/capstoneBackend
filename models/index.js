import mongoose from "mongoose";

const userSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    default: 'employee'
  },
  designation:{
    type: String,
    default: 'employee'
  },
  testPass:{type:String},
  sleepData: {
    lastSleepDuration: { type: Number }, // in hours
    lastSleepDate: { type: Date }, // last sleep date
  },
  employee_ID:{
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  certifications: {
    type: [String],
  },
  preferredShifts: {
    type: [String],
  },
  preferredRoutes: {type:[String]},
  unavailableDates: {type:[Date]},
  healthMetrics: {
    fatigueLevel: { type: Number },
    sleepHours: { type: Number },
    heartRate: { type: Number },
  },
}, {
  timestamps: true
}
);
const User = mongoose.model('User', userSchema);

export { User };