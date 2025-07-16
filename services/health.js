import { bloodPressure } from '../models/bloodPressure.js';
import { Weight } from '../models/weight.js'

const saveBP = async (payload = {}) => {
  try {
    const { userID, datetime, diastolic, systolic, status } = payload;

    const bpEntry = new bloodPressure({
      userID,
      datetime,
      diastolic,
      systolic,
      status,
    });

    const result = await bpEntry.save(); // attempt to save to DB

    return { message: 'Blood pressure saved successfully', data: result };
  } catch (error) {
    return { error: 'Internal server error' };
  }
};

const getBpData = async (userID) => {
  try {
    const bpData = await bloodPressure.find({ userID }).sort({ datetime: -1 });
    return bpData;
  } catch (error) {
    console.error('Error fetching blood pressure data:', error);
    throw new Error('Internal server error');
  }
}
const healthDataForFamily = async (userID) => {
  try {
    const getUser = await User.findOne({ familyCode });
    let newId = getUser._id;

    const bpData = await bloodPressure.find({ userID:newId }).sort({ datetime: -1 });
    const weightData = await Weight.find({ userID:newId }).sort({ datetime: -1 });
    return {
      bloodPressure: bpData,
      weight: weightData,
    };
  } catch (error) {
    console.error('Error fetching blood pressure data:', error);
    throw new Error('Internal server error');
  }
}

const deleteBpData = async (userID, datetime) => {
  try {
    const result = await bloodPressure.deleteOne({ userID, datetime });
    console.log(`Attempted BP delete: userID=${userID}, datetime=${datetime}, deletedCount=${result.deletedCount}`);
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting BP data:', error);
    throw new Error('Failed to delete BP data.');
  }
};

export { saveBP, getBpData, deleteBpData, healthDataForFamily };
