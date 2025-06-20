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
          status
        });
    
        await bpEntry.save();
    
        return{ message: 'Blood pressure saved successfully', data: bpEntry };
      } catch (error) {
        console.error('Error saving blood pressure:', error);
        return({ error: 'Internal server error' });
      }
}

export { saveBP };
