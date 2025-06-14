
import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByUUID,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getAllUsers', getAllUsers);
router.get('/:uuid', getUserByUUID);
router.put('/:uuid', updateUser);
router.delete('/:uuid', deleteUser);

export default router;
