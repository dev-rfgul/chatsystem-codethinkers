import MessageModel from '../models/messageModel.js';
import UserModel  from '../models/userModel.js'

// Create a new message
export const createMessage = async (req, res) => {
    try {
        const { userID, message } = req.body;

        // 1. Create message
        const newMessage = new MessageModel({ userID, message });
        const savedMessage = await newMessage.save();

        // 2. Link message to user (if userID is provided)
        if (userID) {
            await UserModel.findByIdAndUpdate(userID, {
                $push: { message: { message: savedMessage._id } }
            });
        }

        res.status(201).json(savedMessage);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error creating message.',error });
    }
};



// Get a single message by ID
export const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await UserModel.findById(id).populate('message.message');

        if (!message) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching message.' });
    }
};

// Update a message by ID
export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const updated = await MessageModel.findByIdAndUpdate(
            id,
            { message },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error updating message.' });
    }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await MessageModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting message.' });
    }
};
