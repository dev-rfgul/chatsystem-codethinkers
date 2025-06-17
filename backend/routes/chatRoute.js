// routes/chatRoutes.js
import express from 'express';
import {
  accessOrCreateChat,
  fetchChats,
  getChatMessages,
} from '../controllers/chatController.js';
import {
  sendMessage,
  getAllMessages,
} from '../controllers/messageController.js';
// import { protect } from '../middleware/authMiddleware.js'; // Auth middleware

const router = express.Router();

// Chat Routes
router.post('/chat',  accessOrCreateChat);//generate a chatid for a user and admin 
router.get('/chats',  fetchChats); //fetch all the chats of a user and admin by its chatid
router.get('/chat/:chatId/messages', getChatMessages);

// Message Routes
router.post('/message', sendMessage); //send msg 
router.get('/messages/:chatId', getAllMessages); //get all messages

export default router;
