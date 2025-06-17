
import express from 'express';
import {
    sendMessage,
    getAllMessages,

} from '../controllers/messageController.js';

const router = express.Router();

router.post('/sendMessage', sendMessage);
router.get('/getAllMessages',getAllMessages)
    
export default router;
