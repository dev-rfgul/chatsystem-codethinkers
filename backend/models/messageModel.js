import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Not required for anonymous users
        },
        uuid: {
            type: String,
            required: function () {
                return !this.userId; // Anonymous users must have a UUID
            },
        },
        name: {
            type: String,
            default: 'Anonymous',
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;