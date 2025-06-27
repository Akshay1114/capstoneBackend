import { bloodPressure } from '../models/bloodPressure.js';
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
    const {       images,        
    journalId,     
    userID,
    title,
    designTemplate,
} = payload;
    // console.log("base64", base64);
    if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: 'No images provided' });
      }
  
      const uploadedImages = [];
  
      for (const img of images) {
        const { base64, fileName, contentType, description } = img;
  
        if (!base64 || !fileName || !contentType) {
          return res.status(400).json({ error: 'Missing image parameters' });
        }
  
        const buffer = Buffer.from(base64, 'base64');
  
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, buffer, {
            contentType,
            upsert: false,
          });
  
        if (uploadError) {
          throw new Error ({ error: uploadError.message });
        }
  
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  
        uploadedImages.push({
          url: data.publicUrl,
          description,
          addedAt: new Date(),
        });
      }
  
      if (journalId) {
        // Update existing journal
        await JournalData.updateOne(
          { _id: journalId, userID },
          { $push: { images: { $each: uploadedImages } } }
        );
        return res.json({ message: "Images added to existing journal" });
      } else {
        // Create new journal
        const newJournal = new JournalData({
          userID,
          title,
          designTemplate,
          images: uploadedImages,
        });
  
        await newJournal.save();
      return ({ message: "Journal created successfully", newJournal });
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
    console.log("journalData", journalData);
    return journalData.reverse();
  } catch (error) {
    console.error('Error fetching blood pressure data:', error);
    throw new Error('Internal server error');
  }
}

const getJournalById = async (userID) => {
  try {
    const journalData = await JournalData.findOne({ _id:userID }).sort({ datetime: -1 });
    console.log("journalData", journalData);
    return journalData;
  } catch (error) {
    console.error('Error fetching blood pressure data:', error);
    throw new Error('Internal server error');
  }
}
export { getJournal, saveJournal, getJournalById };
