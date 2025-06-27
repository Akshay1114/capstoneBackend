import mongoose from "mongoose";

const BloodPressureSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  systolic: { type: String, required: true },
  diastolic: { type: String, required: true },
  datetime: { type: String, required: true },
  status: { type: String, required: true },
});

export const BloodPressure = mongoose.model("BloodPressure", BloodPressureSchema);
