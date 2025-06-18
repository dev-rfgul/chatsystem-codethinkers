

// controllers/messageController.js
import Message from '../models/messageModel.js';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';

import {io,connectedUser}from  '../index.js';


// export const sendMessage = async (req, res) => {
//   const { chatID, message, senderType, userID } = req.body;

//   try {
//     const newMessage = new Message({
//       chatID,
//       userID: userID || null,
//       message,
//       senderType,
//     });

//     const savedMessage = await newMessage.save();

//     // Update chat with the last message
//     await Chat.findByIdAndUpdate(chatID, { lastMessage: savedMessage._id });

//     // Update user's message list (optional)
//     if (userID) {
//       await User.findByIdAndUpdate(userID, {
//         $push: { message: { message: savedMessage._id } }
//       });
//     }

//     const populatedMsg = await savedMessage.populate('userID', 'name email');

//     res.status(201).json(populatedMsg);
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: err.message });
//   }
// };


// @desc Get all messages in a chat


export const sendMessage = async (req, res) => {
  const { chatID, message, senderType, userID } = req.body;

  try {
    const newMessage = new Message({
      chatID,
      userID: userID || null,
      message,
      senderType,
    });

    const savedMessage = await newMessage.save();

    await Chat.findByIdAndUpdate(chatID, { lastMessage: savedMessage._id });

    if (userID) {
      await User.findByIdAndUpdate(userID, {
        $push: { message: { message: savedMessage._id } }
      });
    }

    const populatedMsg = await savedMessage.populate('userID', 'name email');

    // ✅ Real-time emit to the other party in the chat
    const chat = await Chat.findById(chatID);

    let targetUserId;
    if (senderType === 'user') {
      targetUserId = chat.adminID; // assuming chat.adminID exists
    } else {
      targetUserId = chat.userID; // assuming chat.userID exists
    }

    const socketId = connectedUser[targetUserId?.toString()];
    if (socketId) {
      io.to(socketId).emit('receiveMessage', populatedMsg);
    }

    res.status(201).json(populatedMsg);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};



export const getAllMessages = async (req, res) => {
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
