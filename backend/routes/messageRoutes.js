import express from 'express';
import {
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/sendMessage', createMessage);
router.get('/:id', getMessageById);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;
