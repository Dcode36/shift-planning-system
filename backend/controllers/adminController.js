import Shift from '../models/shift.js';
import Availability from '../Models/Availability.js';
// Create a new shift
export const createShift = async (req, res) => {
    try {
        const { assignedEmployee, shiftTime, duration, timeZone } = req.body;
        const newShift = new Shift({ assignedEmployee, shiftTime, duration, timeZone });
        await newShift.save();
        res.status(201).json(newShift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a shift
export const updateShift = async (req, res) => {
    try {
        const { shiftId } = req.params;
        const updates = req.body;
        const updatedShift = await Shift.findByIdAndUpdate(shiftId, updates, { new: true });
        res.status(200).json(updatedShift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a shift
export const deleteShift = async (req, res) => {
    try {
        const { shiftId } = req.params;
        await Shift.findByIdAndDelete(shiftId);
        res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all shifts
export const getAllShifts = async (req, res) => {
    try {
        const shifts = await Shift.find();
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign shift to an employee
export const assignShift = async (req, res) => {
    try {
        const { shiftId, employeeId } = req.body;
        const shift = await Shift.findById(shiftId);
        if (!shift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        shift.assignedEmployee = employeeId;
        await shift.save();
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllAvailabilities = async (req, res) => {
    try {
        const availabilities = await Availability.find();
        res.status(200).json(availabilities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}