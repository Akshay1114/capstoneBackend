import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();
// const uri = '';
const uri = process.env.URI;
console.log('uri', uri);
const connectDB = async () => {
  console.log('Connecting to DB');
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
      .then(() => console.log('Connected Successfully'))
      .catch((err) => {
        console.log('Error:', err);
        console.error('Not Connected')
      });
}
  export { connectDB };