import express from 'express';
import { createAvailability, getAvailabilities } from '../Controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-availability', authMiddleware, createAvailability);
router.get('/get-availability', authMiddleware, getAvailabilities);

export default router;
