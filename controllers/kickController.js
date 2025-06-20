// controllers/kickController.js
import { Kick } from "../models/kick.js";

// Save one kick entry
export const saveKick = async (req, res) => {
  try {
    const { userId, date, count, time } = req.body;

    if (!userId || !date || !time || typeof count !== "number") {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const newKick = new Kick({
      userId,
      date: new Date(date),
      time,
      count,
    });

    await newKick.save();
    res.status(201).json({ message: "Kick data saved", _id: newKick._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET kicks by date and user
export const getKicks = async (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: "Missing userId or date" });
  }

  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const kicks = await Kick.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    res.json(kicks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a kick entry by ID
export const deleteKick = async (req, res) => {
  console.log("hi");
  try {
    const deleted = await Kick.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Kick not found" });
    }
    res.json({ message: "Kick deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

