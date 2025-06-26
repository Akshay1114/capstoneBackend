import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userID: { type: String },
  title:  { type: String },
  designTemplate:  { type: String }, // e.g., "classic", "modern", "scrapbook"
  images: {type:Array}
});

const JournalData = mongoose.model('JournalData', journalSchema);

export {JournalData};
