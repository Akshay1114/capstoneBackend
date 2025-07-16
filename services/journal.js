import { bloodPressure } from '../models/bloodPressure.js';
import { User } from '../models/index.js';
import dotenv from "dotenv";
import { JournalData } from '../models/journal.js';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const SUPABASE_URL = 'https://loqjctqlroqrvxfoqdjr.supabase.co';
const SUPABASE_KEY = process.env.SERVICE_ROLE;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// const saveJournal = async (payload = {}) => {
//   try {
//     // const { userID, datetime, diastolic, systolic, status } = payload;
//     // console.log("UPDATE", payload);
//     const {       images,        
//     journalId,     
//     userID,
//     title,
//     designTemplate,
// } = payload;
//     console.log("images==>", images);
//     if (!Array.isArray(images) || images.length === 0) {
//       throw new Error({ error: 'No images provided' });
//       }
  
//       const uploadedImages = [];
  
//       for (const img of images) {
//         const { base64, fileName, contentType, description } = img;
  
//         if (!base64 || !fileName || !contentType) {
//           throw new Error({ error: 'Missing image parameters' });
//         }
  
//         const buffer = Buffer.from(base64, 'base64');
  
//         const { error: uploadError } = await supabase.storage
//           .from('images')
//           .upload(fileName, buffer, {
//             contentType,
//             upsert: false,
//           });
  
//         if (uploadError) {
//             throw new Error ({ error: uploadError.message });
//         }
  
//         const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  
//         uploadedImages.push({
//           url: data.publicUrl,
//           description,
//           addedAt: new Date(),
//         });
//       }
  
//       if (journalId) {
//         // Update existing journal
//         console.log("journalId", journalId);
//         console.log("uploadedImages==>>>", uploadedImages);
//         await JournalData.updateOne(
//           { _id: journalId },
//           { $push: { images: { $each: uploadedImages } } }
//         );
//         return ({ message: "Images added to existing journal" });
//       } else {
//         // Create new journal
//         const newJournal = new JournalData({
//           userID,
//           title,
//           designTemplate,
//           images: uploadedImages,
//         });
  
//         await newJournal.save();
//       return ({ message: "Journal created successfully", newJournal });
//     }


//     // return{ message: 'Blood pressure saved successfully', data: "bpEntry" };
//   } catch (error) {
//     console.error('UPDATING AND SAVING JOURNAL:', error);
//     return ({ error: 'Internal server error' });
//   }
// }
const saveJournal = async (payload = {}) => {
  try {
    const {
      images,
      journalId,
      userID,
      title,
      designTemplate,
    } = payload;

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("No images provided");
    }

    const uploadedImages = [];

    for (const img of images) {
      // ✅ SKIP upload if already uploaded (has a URL)
      if (img.url) {
        uploadedImages.push({
          url: img.url,
          description: img.description || "",
          addedAt: new Date(),
        });
        continue;
      }

      // ✅ Only upload if base64 image is present (new upload)
      const { base64, fileName, contentType, description } = img;

      if (!base64 || !fileName || !contentType) {
        throw new Error("Missing image parameters for new upload");
      }

      const buffer = Buffer.from(base64, "base64");

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, buffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);

      uploadedImages.push({
        url: data.publicUrl,
        description,
        addedAt: new Date(),
      });
    }

    if (journalId) {
      // ✅ UPDATE existing journal with new + existing images
      await JournalData.updateOne(
        { _id: journalId },
        { $push: { images: { $each: uploadedImages } } }
      );

      return { message: "Images added to existing journal" };
    } else {
      // ✅ CREATE new journal
      const newJournal = new JournalData({
        userID,
        title,
        designTemplate,
        images: uploadedImages,
      });

      await newJournal.save();
      return { message: "Journal created successfully", journal: newJournal };
    }
  } catch (error) {
    console.error("UPDATING AND SAVING JOURNAL:", error.message || error);
    return { error: error.message || "Internal server error" };
  }
};


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
const getJournalFamilyCode = async (familyCode) => {
  try {
    const getUser = await User.findOne({ familyCode });
    let newId = getUser._id;
    // console.log("getUser", getUser);
    const journalData = await JournalData.find({ userID:newId }).sort({ datetime: -1 });
    console.log("journalData", journalData);
    return journalData.reverse();
  } catch (error) {
    console.error('Error fetching blood pressure data:', error);
    throw new Error('Internal server error');
  }
}
export { getJournal, saveJournal, getJournalById, getJournalFamilyCode };
