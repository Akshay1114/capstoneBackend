import mongoose from 'mongoose';

const weightSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  value: {
    type: String, // or Number if preferred
    required: true,
  },
  unit: {
    type: String, // 'kg' or 'lbs'
    enum: ['kg', 'lbs'],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export const Weight = mongoose.model('Weight', weightSchema);
