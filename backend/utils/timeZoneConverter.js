import moment from 'moment-timezone';

export const convertShiftTime = (shiftTimeUTC, timeZone) => {
    return moment.utc(shiftTimeUTC).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
};
