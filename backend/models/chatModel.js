import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        groupName: {
            type: String,
            trim: true,
        },
        groupAvatar: {
            type: String,
            default: '',
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    },
    { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
