import mongoose from 'mongoose';
import MessageModel from '../models/messageModel.js';
import UserModel from '../models/userModel.js'

// Create a new message
export const createMessage = async (req, res) => {
    try {
        const { userID, message } = req.body;
        console.log("Creating message:", { userID, message });

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
        res.status(500).json({ error: 'Error creating message.', error });
    }
};

//get msg of a user
// import mongoose from "mongoose";

export const getMessageByUserID = async (req, res) => {
    try {
        const userID = req.params.id;
        console.log(userID)
        const message = await MessageModel.find({ userID }).select('message');
        
        if (!message || message.length === 0) {
            return res.status(404).json({ error: "No messages found" });
        }

        res.status(200).json({ message });
    } catch (err) {
        res.status(500).json({ error: "Invalid userID or internal error" });
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
