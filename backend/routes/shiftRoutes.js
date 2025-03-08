import express from 'express';
import { assignShift, getShifts } from '../controllers/shiftController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/assign', authMiddleware,isAdmin,  assignShift); // Assign shift (Admin)
router.get('/', authMiddleware, getShifts); // Get all shifts

export default router;
