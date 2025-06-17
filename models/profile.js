const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  due_date :{ type: Date },
  phone:{type : String},
  family_members: [{
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    age: { type: Number }
  }],
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
