
import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    chatID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderType: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;