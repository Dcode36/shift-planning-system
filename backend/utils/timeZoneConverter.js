import moment from 'moment-timezone';

/**
 * Converts a given shift time to the target time zone.
 * @param {string} date - The shift date (YYYY-MM-DD format).
 * @param {string} shiftTime - The shift time (e.g., "09:00 AM").
 * @param {string} fromTimeZone - The original time zone.
 * @param {string} toTimeZone - The target time zone.
 * @returns {string} - Converted time in 'YYYY-MM-DD hh:mm A' format.
 */
export const convertShiftTime = (date, shiftTime, fromTimeZone, toTimeZone) => {
    const fullDateTime = `${date} ${shiftTime}`; // Combine date and time
    return moment.tz(fullDateTime, 'YYYY-MM-DD hh:mm A', fromTimeZone).tz(toTimeZone).format('YYYY-MM-DD hh:mm A');
};
