import { Weight } from '../models/weight.js';

// Save a new weight entry
export const saveWeight = async (payload = {}) => {
  try {
    const { userID, value, unit, date } = payload;

    const entry = new Weight({
      userID,
      value,
      unit,
      date,
    });

    await entry.save();
    return { message: 'Weight saved successfully', data: entry };
  } catch (error) {
    console.error('❌ Error saving weight:', error);
    throw new Error('Failed to save weight');
  }
};

// Get weight data by userID (latest first)
export const getWeightData = async (userID) => {
  try {
    const data = await Weight.find({ userID }).sort({ date: -1 });
    return data;
  } catch (error) {
    console.error('❌ Error fetching weight data:', error);
    throw new Error('Failed to fetch weight data');
  }
};

export const deleteWeightData = async (userID, date) => {
  try {
    const result = await Weight.deleteOne({ userID, date });
    console.log(`Attempted Weight delete: userID=${userID}, date=${date}, deletedCount=${result.deletedCount}`);
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting weight data:', error);
    throw new Error('Failed to delete weight data.');
  }
};
