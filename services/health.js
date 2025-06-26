import {BloodPressure} from '../models/bloodPressure.js';
import { User } from '../models/index.js';
import dotenv from "dotenv";


const saveBP = async (payload = {}) => {
  try {
    const { userID, datetime, diastolic, systolic, status } = payload;

    const bpEntry = new BloodPressure({
      userID,
      datetime,
      diastolic,
      systolic,
      status,
    });

    console.log('Attempting to save:', bpEntry); // ✅ log before save

    const result = await bpEntry.save(); // attempt to save to DB

    console.log('✅ Successfully saved to DB:', result); // ✅ confirm saved

    return { message: 'Blood pressure saved successfully', data: result };
  } catch (error) {
    console.error('❌ Error saving BP:', error);
    return { error: 'Internal server error' };
  }
};

const getBpData = async (userID) => {
    try {
        const bpData = await BloodPressure.find({ userID }).sort({ datetime: -1 });
        return bpData;
      } catch (error) {
        console.error('Error fetching blood pressure data:', error);
        throw new Error('Internal server error');
      }
}
export { saveBP, getBpData };
