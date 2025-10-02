import { Router } from 'express';
import {
  get_users,
  login,
  register,
  verifyToken,
} from '../controller/user.controller.js';

const router = Router();

router.get('/users', get_users);
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken);

export default router;
