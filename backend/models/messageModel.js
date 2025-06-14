import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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