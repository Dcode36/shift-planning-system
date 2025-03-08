import Shift from '../models/shift.js';
import moment from 'moment-timezone';
import User from '../models/User.js';

// Assign Shift (Admin Only)
export const assignShift = async (req, res) => {
    const { employeeId, shiftTime, duration } = req.body;

    try {
        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Convert shift time from employee's time zone to UTC
        const shiftTimeUTC = moment.tz(shiftTime, employee.timeZone).utc().toDate();

        const newShift = new Shift({
            assignedEmployee: employeeId,
            shiftTime: shiftTimeUTC,
            duration,
            timeZone: employee.timeZone,
        });

        await newShift.save();
        res.status(201).json({ message: 'Shift assigned successfully', shift: newShift });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Assigned Shifts
export const getShifts = async (req, res) => {
    try {
        const shifts = await Shift.find().populate('assignedEmployee', 'name email timeZone');
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
