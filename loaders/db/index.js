// loaders/db/index.js
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();


// const uri = '';
const uri = process.env.URI;
console.log('uri', process.env.PORT);

const connectDB = async () => {
  console.log('Connecting to DB...');
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export { connectDB };
