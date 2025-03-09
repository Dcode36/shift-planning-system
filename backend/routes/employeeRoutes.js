import express from 'express';
import { createAvailability, getAvailabilities, getAvailableEmployees, getAssignedShifts } from '../controllers/employeeController.js';
import { authMiddleware, isAdmin, isEmployee } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-availability', authMiddleware, createAvailability);
router.get('/get-availability', authMiddleware, getAvailabilities);
router.get('/get-available-employees', authMiddleware, isAdmin, getAvailableEmployees);
router.get('/assigned-shifts/:id', authMiddleware, isEmployee, getAssignedShifts);
export default router;
