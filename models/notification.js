import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({

    message: {type:String},
    recipient: {type:String},
    senderID: {type:String},
    senderName: {type:String},
    scheduleID: {type:String},},
     {
  timestamps: true
}
);
const Notification = mongoose.model('Notification', notificationSchema);

export { Notification };