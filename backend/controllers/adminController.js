import Shift from '../models/Shift.js';
import Availability from '../models/Availability.js';
import { convertShiftTime } from '../utils/timeZoneConverter.js';
import User from '../models/User.js';
// Create a new shift
export const createShift = async (req, res) => {
    try {
        const { assignedEmployee, date, startTime, endTime, timeZone } = req.body;

        if (!date || !startTime || !endTime || !timeZone) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const newShift = new Shift({ assignedEmployee, date, startTime, endTime, timeZone });
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
        const { startTime, endTime } = req.body;

        if (startTime && endTime && startTime >= endTime) {
            return res.status(400).json({ message: 'Start time must be before end time' });
        }

        const updatedShift = await Shift.findByIdAndUpdate(shiftId, req.body, { new: true });

        if (!updatedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }

        res.status(200).json(updatedShift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a shift
export const deleteShift = async (req, res) => {
    try {
        const { shiftId } = req.params;
        const deletedShift = await Shift.findByIdAndDelete(shiftId);

        if (!deletedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }

        res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all shifts
export const getAllShifts = async (req, res) => {
    try {
        const { adminTimeZone } = req.query; // Get Admin's time zone from request

        const shifts = await Shift.find().populate('assignedEmployee', 'name email');

        // Convert startTime and endTime to admin's time zone
        const convertedShifts = shifts.map(shift => ({
            ...shift._doc,
            startTime: convertShiftTime(shift.date, shift.startTime, shift.timeZone, adminTimeZone),
            endTime: convertShiftTime(shift.date, shift.endTime, shift.timeZone, adminTimeZone),
            originalTimeZone: shift.timeZone, // Update time zone to admin's time zone
            convertedTimezone: adminTimeZone
        }));

        res.status(200).json(convertedShifts);
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

// Get all employee availabilities
export const getAllAvailabilities = async (req, res) => {
    try {
        const availabilities = await Availability.find();

        // Fetch user details for each availability
        const availabilitiesWithUser = await Promise.all(
            availabilities.map(async (availability) => {
                const user = await User.findById(availability.employeeId);
                return {
                    ...availability.toObject(),
                    userName: user ? user.name : "Unknown",
                    email: user ? user.email : "Unknown" // Add user name
                };
            })
        );

        res.status(200).json(availabilitiesWithUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
