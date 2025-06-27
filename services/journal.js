import { BloodPressure } from '../models/bloodPressure.js';
import { User } from '../models/index.js';
import dotenv from "dotenv";
import { JournalData } from '../models/journal.js';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const SUPABASE_URL = 'https://loqjctqlroqrvxfoqdjr.supabase.co';
const SUPABASE_KEY = process.env.SERVICE_ROLE;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const saveJournal = async (payload = {}) => {
  try {
    // const { userID, datetime, diastolic, systolic, status } = payload;
    console.log("payload", payload);
    const { base64, fileName, contentType, journalId, userID, description, title, designTemplate } = payload;
    console.log("base64", base64);
    if (!base64 || !fileName || !contentType) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const buffer = Buffer.from(base64, 'base64');

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new Error({ error: error.message });
    }

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    console.log("data", data);
    const imageObject = {
      url: data,
      description,
      addedAt: new Date(),
    };
    if (journalId) {
      // Update existing journal
      await JournalData.updateOne(
        { _id: journalId, userID: userID },
        { $push: { images: imageObject } }
      );
      return ({ message: "Image added to journal", publicUrl });
    } else {
      // Create new journal
      const journal = new JournalData({
        userID: userID,
        title,
        designTemplate,
        images: [imageObject],
      });
      await journal.save();
      return ({ message: "Journal created successfully", journal });
    }


    // return{ message: 'Blood pressure saved successfully', data: "bpEntry" };
  } catch (error) {
    console.error('Error saving blood pressure:', error);
    return ({ error: 'Internal server error' });
  }
}

const getJournal = async (userID) => {
  try {
    const journalData = await JournalData.find({ userID }).sort({ datetime: -1 });
    return journalData;
  } catch (error) {
    console.error('Error fetching blood pressure data:', error);
    throw new Error('Internal server error');
  }
}
export { getJournal, saveJournal };
