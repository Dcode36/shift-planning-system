import express from 'express';
import { createShift, updateShift, deleteShift, getAllShifts, assignShift, getAllAvailabilities } from '../controllers/adminController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(authMiddleware);
router.post('/create-shift', isAdmin, createShift); //ok
router.put('/update-shift/:shiftId', isAdmin, updateShift); //pl
router.delete('/delete-shift/:shiftId', isAdmin, deleteShift);
router.get('/all-shifts', getAllShifts);//ok
router.post('/assign-shift', isAdmin, assignShift);
router.get('/get-all-availabilities', isAdmin, getAllAvailabilities);
export default router;
