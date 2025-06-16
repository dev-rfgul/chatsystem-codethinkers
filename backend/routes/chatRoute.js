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
router.post('/chat',  accessOrCreateChat);
router.get('/chats',  fetchChats);
router.get('/chat/:chatId/messages', getChatMessages);

// Message Routes
router.post('/message', sendMessage);
router.get('/messages/:chatId', getAllMessages);

export default router;
