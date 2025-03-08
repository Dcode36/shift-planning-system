import express from 'express';
import { createAvailability, getAvailabilities, getAvailableEmployees } from '../Controllers/employeeController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-availability', authMiddleware, createAvailability);
router.get('/get-availability', authMiddleware, getAvailabilities);
router.get('/get-available-employees', authMiddleware, isAdmin, getAvailableEmployees);
export default router;
