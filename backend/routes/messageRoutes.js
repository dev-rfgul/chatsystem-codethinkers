import express from 'express';
import {
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage,
    getMessageByUserID

} from '../controllers/messageController.js';

const router = express.Router();

router.post('/sendMessage', createMessage);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);
router.get('/:id',getMessageByUserID)

export default router;
