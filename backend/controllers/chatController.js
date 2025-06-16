// controllers/chatController.js
import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// @desc    Create or get one-to-one chat
// replace with your actual admin user ID from MongoDB
const ADMIN_USER_ID = '684fcdd6757e3b80d4904dea'; 

export const accessOrCreateChat = async (req, res) => {
  const { senderId } = req.body; // guest's ID

  if (!senderId) {
    return res.status(400).json({ message: "SenderId is required" });
  }

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [senderId, ADMIN_USER_ID] },
    }).populate('participants', '-password');

    if (chat) return res.status(200).json(chat);

    const newChat = new Chat({ participants: [senderId, ADMIN_USER_ID] });
    const createdChat = await newChat.save();
    const fullChat = await Chat.findById(createdChat._id).populate('participants', '-password');

    res.status(201).json(fullChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Get all chats for logged-in user
export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.user._id] },
    })
      .populate('participants', '-password')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'userID',
          select: 'name email',
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get messages for a specific chat
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatID: chatId })
      .populate('userID', 'name email isAdmin')
      .sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
