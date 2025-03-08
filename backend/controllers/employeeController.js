import Availability from '../Models/Availability.js';
import moment from 'moment-timezone';


export const createAvailability = async (req, res) => {
    try {
        const { date, timeZone, startTime, endTime } = req.body;

        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Convert the given date to the specified timezone
        const userDate = moment.tz(date, timeZone);
        const now = moment.tz(timeZone).startOf('day'); // Get current day in the user's timezone
        const startOfWeek = now.clone().startOf('week'); // Start of the current week (Sunday)
        const endOfWeek = now.clone().endOf('week'); // End of the current week (Saturday)

        // Validate that the date falls within the current week
        if (!userDate.isBetween(startOfWeek, endOfWeek, 'day', '[]')) {
            return res.status(400).json({ message: 'Availability must be within the current week (Sunday to Saturday).' });
        }

        // Ensure startTime and endTime are in 12-hour AM/PM format
        const timeFormat = 'hh:mm A'; // 12-hour format with AM/PM
        if (!moment(startTime, timeFormat, true).isValid() || !moment(endTime, timeFormat, true).isValid()) {
            return res.status(400).json({ message: 'Start time and end time must be in HH:MM AM/PM format.' });
        }

        // Convert startTime and endTime to moment objects in the correct timezone
        const start = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm A', timeZone);
        const end = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD hh:mm A', timeZone);

        // Validate that availability is at least 4 hours
        if (end.diff(start, 'hours') < 4) {
            return res.status(400).json({ message: 'Availability must be at least 4 hours.' });
        }

        // Ensure start time is before end time
        if (!end.isAfter(start)) {
            return res.status(400).json({ message: 'End time must be after start time.' });
        }

        // Find if availability already exists for the employee
        let availability = await Availability.findOne({ employeeId: req.user.id });

        if (!availability) {
            // Create new availability if it doesn't exist
            availability = new Availability({
                employeeId: req.user.id,
                timeZone,
                availability: [{ date, startTime, endTime }]
            });
        } else {
            // Push new date into the existing availability array
            availability.availability.push({ date, startTime, endTime });
        }

        await availability.save();
        res.status(201).json(availability);
    } catch (error) {
        console.error('Error creating availability:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getAvailabilities = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const availabilities = await Availability.find({ employeeId: req.user.id });
        res.status(200).json(availabilities);
    } catch (error) {
        console.error('Error fetching availabilities:', error);
        res.status(500).json({ message: error.message });
    }
};
