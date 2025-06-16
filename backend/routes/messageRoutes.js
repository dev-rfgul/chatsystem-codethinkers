// import express from 'express';
// import {
//     createMessage,
//     updateMessage,
//     deleteMessage,
//     getMessageByUserID

// } from '../controllers/messageController.js';

// const router = express.Router();

// router.post('/sendMessage', createMessage);
// router.put('/:id', updateMessage);
// router.delete('/:id', deleteMessage);
// router.get('/:id',getMessageByUserID)
    
// export default router;


import express from 'express';
import {
    sendMessage,
    getAllMessages,

} from '../controllers/messageController.js';

const router = express.Router();

router.post('/sendMessage', sendMessage);
router.get('/getAllMessages',getAllMessages)
    
export default router;
