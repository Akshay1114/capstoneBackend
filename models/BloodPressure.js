import mongoose from "mongoose";

const bloodPressureSchema = new mongoose.Schema({
  datetime: { type: String },
  diastolic: { type: String },
  status: { type: String },
  systolic: { type: String },
  userID: {
    type: String,
    required: true,
  },
});

export const bloodPressure = mongoose.model("bloodPressure", bloodPressureSchema);
