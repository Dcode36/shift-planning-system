import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios'
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Backdrop,
    Fade,
    Modal,
    MenuItem,
    Select,
    Card,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions

} from '@mui/material';
import AddAvailability from './AddAvailibility';
import CircularProgress from '@mui/material/CircularProgress';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Close from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import moment from "moment-timezone";
const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('availability');
    const user = JSON.parse(localStorage.getItem('user'));
    const [shifts, setShifts] = useState([]);
    const [employeesAvailability, setEmployeesAvailability] = useState([]);
    // Set active tab based on URL when component mounts
    useEffect(() => {
        // Check if path includes "availability"
        if (location.pathname.includes('availability')) {
            setActiveTab('shifts');
        } else {
            setActiveTab('availability');
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/employee?tab=${tab}`);
    };


    const fetchShifts = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user?._id) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/employee/assigned-shifts/${user._id}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error("Error fetching shifts:", error.response?.data || error.message);
        }
    };


    useEffect(() => {
        fetchShifts();
    }, [])




    const CustomTab = ({ name, label, isActive }) => (
        <Button
            onClick={() => handleTabChange(name)}
            sx={{
                fontSize: '16px',
                fontWeight: isActive ? 'bold' : 'normal',
                color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                borderBottom: isActive ? '3px solid #1976d2' : '3px solid transparent',
                borderRadius: 0,
                padding: '15px 25px',
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    borderBottom: isActive ? '3px solid #1976d2' : '3px solid rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            {label}
        </Button>
    );

    const TableToolbar = ({ title }) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <AddAvailability />
            </Box>
        </Box>
    );



    const AssignedShiftTable = () => {
        const [open, setOpen] = useState(false);
        const [infoDialogOpen, setInfoDialogOpen] = useState(false);
        const [selectedShift, setSelectedShift] = useState(null);
        const [availableEmployees, setAvailableEmployees] = useState([]);
        const [selectedEmployee, setSelectedEmployee] = useState("");
        const [shifts, setShifts] = useState([]);
        const [loading, setLoading] = useState(true);
        const navigate = useNavigate();

        // Safely get user data from localStorage with error handling
        const getUserData = () => {
            try {
                const userData = localStorage.getItem("user");
                return userData ? JSON.parse(userData) : null;
            } catch (error) {
                console.error("Error parsing user data:", error);
                return null;
            }
        };

        const user = getUserData();

        useEffect(() => {
            if (!user) {
                navigate("/login");
                return;
            }
            fetchShifts();
        }, []);

        const fetchShifts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const { data } = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/api/employee/assigned-shifts/${user._id}`,
                    { headers: { Authorization: `${token}` } }
                );

                setShifts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching shifts:", error);
                setLoading(false);
            }
        };

        const handleOpen = async (shift) => {
            setSelectedShift(shift);
            setOpen(true);
            await fetchAvailableEmployees(shift);
        };

        const handleClose = () => {
            setOpen(false);
            setSelectedEmployee("");
        };

        const handleInfoOpen = (shift) => {
            setSelectedShift(shift);
            setInfoDialogOpen(true);
        };

        const handleInfoClose = () => {
            setInfoDialogOpen(false);
        };

        const fetchAvailableEmployees = async (shift) => {
            try {
                const { date, startTime, endTime, originalTimeZone } = shift;
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const { data } = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/api/employee/get-available-employees`,
                    {
                        params: { date, startTime, endTime, timeZone: originalTimeZone },
                        headers: { Authorization: `${token}`, "Content-Type": "application/json" }
                    }
                );

                setAvailableEmployees(data);
            } catch (error) {
                console.error("Error fetching available employees:", error);
            }
        };

        const handleAssignEmployee = async () => {
            if (!selectedShift || !selectedEmployee) return;

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                await axios.put(
                    `${process.env.REACT_APP_SERVER_URL}/api/admin/update-shift/${selectedShift._id}`,
                    { assignedEmployee: selectedEmployee },
                    { headers: { Authorization: `${token}`, "Content-Type": "application/json" } }
                );

                fetchShifts();
                handleClose();
            } catch (error) {
                console.error("Error assigning employee:", error);
            }
        };

        // Format date to display like "Monday, March 9"
        const formatDate = (dateString) => {
            try {
                const options = { weekday: 'long', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('en-US', options);
            } catch (error) {
                console.error("Error formatting date:", error);
                return dateString;
            }
        };

        // Format time to display in 12-hour format with am/pm
        const formatTime = (timeString) => {
            try {
                // Check if timeString is already in 12-hour format (e.g., "2:30 PM")
                if (timeString.includes('AM') || timeString.includes('PM')) {
                    return timeString;
                }

                // If timeString is in 24-hour format (e.g., "14:30")
                let [hours, minutes] = timeString.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12; // Convert to 12-hour format
                return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
            } catch (error) {
                console.error("Error formatting time:", error);
                return timeString;
            }
        };

        // Format shift time range with proper timezone conversion
        const formatShiftTime = (shift) => {
            try {
                if (!shift || !user || !shift.timeZone || !user.timeZone) {
                    return `${shift?.startTime || 'N/A'} to ${shift?.endTime || 'N/A'}`;
                }

                const adminTimezone = shift.timeZone;
                const userTimezone = user.timeZone;

                const convertTime = (time) => {
                    try {
                        // Handle both formats: 24-hour or 12-hour
                        const timeFormat = time.includes('AM') || time.includes('PM') ?
                            "YYYY-MM-DD hh:mm A" : "YYYY-MM-DD HH:mm";

                        return moment.tz(`${shift.date} ${time}`, timeFormat, adminTimezone)
                            .tz(userTimezone)
                            .format("hh:mm A");
                    } catch (e) {
                        console.error("Time conversion error:", e);
                        return time;
                    }
                };

                return `${convertTime(shift.startTime)} to ${convertTime(shift.endTime)}`;
            } catch (error) {
                console.error("Error in formatShiftTime:", error);
                return `${shift?.startTime || 'N/A'} to ${shift?.endTime || 'N/A'}`;
            }
        };

        // Calculate shift duration with improved error handling
        const calculateDuration = (shift) => {
            try {
                // Standardize time format
                const parseTime = (timeStr) => {
                    let hours, minutes, isPM;

                    // Handle different formats
                    if (timeStr.includes(':')) {
                        const timeParts = timeStr.split(' ');
                        const [h, m] = timeParts[0].split(':').map(Number);

                        if (timeParts.length > 1) {
                            // 12-hour format with AM/PM
                            isPM = timeParts[1] === 'PM';
                            hours = isPM && h !== 12 ? h + 12 : (h === 12 && !isPM ? 0 : h);
                            minutes = m;
                        } else {
                            // 24-hour format
                            hours = h;
                            minutes = m;
                        }
                    } else {
                        // Simple hour format (e.g., "9 AM")
                        const [h, period] = timeStr.split(' ');
                        hours = Number(h);
                        isPM = period === 'PM';
                        hours = isPM && hours !== 12 ? hours + 12 : (hours === 12 && !isPM ? 0 : hours);
                        minutes = 0;
                    }

                    return { hours, minutes };
                };

                const start = parseTime(shift.startTime);
                const end = parseTime(shift.endTime);

                // Calculate total minutes
                let startMinutes = start.hours * 60 + start.minutes;
                let endMinutes = end.hours * 60 + end.minutes;

                // Handle overnight shifts
                if (endMinutes < startMinutes) {
                    endMinutes += 24 * 60; // Add a day
                }

                const durationMinutes = endMinutes - startMinutes;
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;

                return `${hours}h${minutes ? ` ${minutes}m` : ""}`;
            } catch (error) {
                console.error("Error calculating duration:", error);
                return "N/A";
            }
        };

        // Early return if no user
        if (!user) {
            return (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Please log in to view your shifts</Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/login")}
                    >
                        Log In
                    </Button>
                </Box>
            );
        }
        const formatDateTime = (isoString) => {
            const date = new Date(isoString);
            return new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }).format(date);
        }
        return (
            <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                    My Assigned Shifts
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : shifts.length > 0 ? (
                    <TableContainer component={Paper} sx={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderRadius: 2 }}>
                        <Table aria-label="shifts table">
                            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Created Time</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Shift Time</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Duration</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shifts.map((shift) => (
                                    <TableRow
                                        key={shift._id}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                        }}
                                    >
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formatDate(shift.date)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {formatDateTime(shift.createdAt) || "N/A"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.timeZone || "No timezone"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                                                <Typography variant="body1">
                                                    {formatShiftTime(shift)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {calculateDuration(shift)}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => handleInfoOpen(shift)}
                                                title="View details"
                                                textAlign="center"
                                                centerRipple
                                            >
                                                <InfoOutlinedIcon />
                                            </IconButton>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <CalendarTodayIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" component="div" sx={{ fontWeight: "medium", mb: 1 }}>
                            No shifts assigned yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            When shifts are assigned to you, they will appear here.
                        </Typography>
                    </Paper>
                )}

                {/* Modal for assigning employee */}
                <Modal open={open} onClose={handleClose}>
                    <Fade in={open}>
                        <Box sx={{
                            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                            width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Assign Employee to Shift
                            </Typography>

                            {selectedShift && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Shift Details
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(selectedShift.date)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatShiftTime(selectedShift)}
                                    </Typography>
                                </Box>
                            )}

                            <Select
                                fullWidth
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Employee</MenuItem>
                                {availableEmployees.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        {employee.name} ({employee.email})
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2 }}
                                onClick={handleAssignEmployee}
                                disabled={!selectedEmployee}
                            >
                                Assign
                            </Button>
                        </Box>
                    </Fade>
                </Modal>

                {/* Info Dialog */}
                <Dialog open={infoDialogOpen} onClose={handleInfoClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Shift Details
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedShift && (
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Date
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {formatDate(selectedShift.date)}
                                </Typography>

                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                    Time
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {formatShiftTime(selectedShift)}
                                </Typography>

                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                    Duration
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {calculateDuration(selectedShift)}
                                </Typography>

                                {selectedShift.location && (
                                    <>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                            Location
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {selectedShift.location}
                                        </Typography>
                                    </>
                                )}

                                {selectedShift.notes && (
                                    <>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                            Notes
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {selectedShift.notes}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleInfoClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    };
    // Fetch Data from API

    const AvailabilityTable = () => {
        const [open, setOpen] = useState(false);
        const [selectedAvailability, setSelectedAvailability] = useState([]);
        const [employeesAvailability, setEmployeesAvailability] = useState([]);

        // Get current week dates
        const getCurrentWeekDates = () => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday

            return days.map((day, index) => {
                const date = new Date(today);
                // Adjust to get all days of current week (Sunday to Saturday)
                date.setDate(today.getDate() - dayOfWeek + index);
                return {
                    day,
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                };
            });
        };

        const weekDates = getCurrentWeekDates();

        const fetchAvailability = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/employee/get-availability`, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json"
                    }
                });

                setEmployeesAvailability(response.data);
            } catch (error) {
                console.error("Error fetching availability data:", error);
            }
        };

        useEffect(() => {
            fetchAvailability();
        }, []);

        const handleOpen = (availability) => {
            setSelectedAvailability(availability);
            setOpen(true);
        };

        const handleClose = () => setOpen(false);

        // Helper function to organize availability by day of week
        const getAvailabilityByDay = (employeeData) => {
            // Create an object to hold availability by day
            const weeklyAvailability = {
                Sunday: [],
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: []
            };

            // Assuming employee data has availability array
            const availability = employeeData?.availability || [];

            // Organize availability by day
            availability.forEach(slot => {
                if (slot.date) {
                    // Convert date string to Date object to get day of week
                    const dateObj = new Date(slot.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                    if (weeklyAvailability[dayName]) {
                        weeklyAvailability[dayName].push(slot);
                    }
                }
            });

            return weeklyAvailability;
        };

        return (
            <Box>
                <TableToolbar title="Weekly Availability Schedule" />
                <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Table aria-label="weekly availability table">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                {/* Column for employee info */}
                                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Employee</TableCell>

                                {/* Days of the week */}
                                {weekDates.map((dateInfo, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{ fontWeight: 'bold' }}
                                        align="center"
                                    >
                                        <Typography variant="subtitle2">{dateInfo.day}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {dateInfo.date}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(employeesAvailability) ? (
                                employeesAvailability.map((employee, index) => {
                                    const weeklyAvailability = getAvailabilityByDay(employee);

                                    return (
                                        <TableRow key={index} hover>
                                            {/* Employee info cell */}
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {user.name || "Employee " + (index + 1)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {employee.timeZone || "Default timezone"}
                                                </Typography>
                                            </TableCell>

                                            {/* One cell for each day of the week */}
                                            {Object.keys(weeklyAvailability).map((day, dayIndex) => (
                                                <TableCell key={dayIndex} align="center">
                                                    {weeklyAvailability[day].length > 0 ? (
                                                        <Box>
                                                            {weeklyAvailability[day].map((slot, slotIndex) => (
                                                                <>
                                                                    <Chip
                                                                        key={slotIndex}
                                                                        label={`${slot.startTime} - ${slot.endTime}`}
                                                                        size="small"
                                                                        color="primary"
                                                                        sx={{ mb: 0.5, maxWidth: '100%' }}
                                                                    />
                                                                    <br />
                                                                </>

                                                            ))}
                                                            {weeklyAvailability[day].length > 2 && (
                                                                <Button
                                                                    variant="text"
                                                                    size="small"
                                                                    onClick={() => handleOpen(weeklyAvailability[day])}
                                                                >
                                                                    View all
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Not available
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No availability data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Availability Modal */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={open}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 450,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 3,
                                borderRadius: 3
                            }}
                        >
                            <Card variant="outlined" sx={{ p: 2 }}>
                                {/* Header with Close Button */}
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" fontWeight="bold">Availability Details</Typography>
                                    <IconButton onClick={handleClose}>
                                        <Close />
                                    </IconButton>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Availability List */}
                                {selectedAvailability.length > 0 ? (
                                    selectedAvailability.map((slot, index) => (
                                        <Card key={index} sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2, mb: 1 }}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {slot.date}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {`${slot.startTime} - ${slot.endTime}`}
                                            </Typography>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography variant="body1" textAlign="center">
                                        No availability data found.
                                    </Typography>
                                )}
                            </Card>
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        );
    };



    return (
        <div className='container'>
            <Navbar />
            <Box sx={{ p: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>

                    <CustomTab name="availability" label="Availability" isActive={activeTab === 'availability'} />
                    <CustomTab name="shifts" label="Shifts" isActive={activeTab === 'shifts'} />
                </Box>
                <Box>
                    {activeTab === 'availability' ? <AvailabilityTable /> : <AssignedShiftTable />}
                </Box>
            </Box>
        </div>
    );
};

export default EmployeeDashboard;