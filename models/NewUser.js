import mongoose from "mongoose";

const NewUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["self", "other"], default: "self" }
});


export default mongoose.models.NewUser || mongoose.model("NewUser", NewUserSchema);
