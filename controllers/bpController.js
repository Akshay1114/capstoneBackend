import { BloodPressure } from "../models/BloodPressure.js";

export const saveBP = async (req, res) => {
  const { userId, systolic, diastolic, datetime, status } = req.body;
  console.log("req.body", req.body);

  if (!userId || !systolic || !diastolic || !datetime || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const bpEntry = new BloodPressure({
      userId,
      systolic,
      diastolic,
      datetime,
      status,
    });

    const saved = await bpEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
