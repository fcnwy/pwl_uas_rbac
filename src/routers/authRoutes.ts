import { Router } from 'express';
import { showLogin, login, logout } from '../controllers/authController';
const router = Router();
router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', logout);
export default router;
