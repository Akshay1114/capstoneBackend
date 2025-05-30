import mongoose from "mongoose";

const userSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  },
 
}, {
  timestamps: true
}
);
const User = mongoose.model('User', userSchema);

export { User };