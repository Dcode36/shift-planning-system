import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, Select, Grid, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

const AddNewShiftModal = () => {
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [shiftData, setShiftData] = useState({
        date: '',
        startTime: null,
        endTime: null,
        timeZone: user.timeZone, // Default to user's time zone
        assignedEmployee: ''
    });
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [employeesFetched, setEmployeesFetched] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setShiftData({ date: '', startTime: null, endTime: null, timeZone: user.timeZone, assignedEmployee: '' });
        setAvailableEmployees([]);
        setEmployeesFetched(false);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShiftData({ ...shiftData, [name]: value });
    };

    const handleTimeChange = (name, time) => {
        if (!time) { return };
        const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        setShiftData((prev) => ({ ...prev, [name]: formattedTime }));
    };

    // Automatically fetch available employees when all required fields are filled
    useEffect(() => {
        if (shiftData.date && shiftData.startTime && shiftData.endTime) {
            fetchAvailableEmployees();
        }
    }, [shiftData.date, shiftData.startTime, shiftData.endTime]);

    const fetchAvailableEmployees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/employee/get-available-employees`, {
                params: shiftData,
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            setAvailableEmployees(data);
            setEmployeesFetched(true);
            // toast.success("Available Employees Fetched Successfully");
        } catch (error) {
            console.error("Error fetching employees:", error);
            setEmployeesFetched(true);
            setAvailableEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!shiftData.date || !shiftData.startTime || !shiftData.endTime || !shiftData.assignedEmployee) {
                return toast.error("Please fill all required fields before submitting.");
            }

            const token = localStorage.getItem('token');

            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/admin/create-shift`, shiftData, {
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });

            if (res.status === 201) {
                toast.success("Shift created successfully! Page Will Automatically Refresh in 5 seconds");
                handleClose();
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again. Please select date and Time that are valid with available employees");
            console.error("Error creating shift:", error);
        }
    };

    const isSubmitEnabled = Boolean(shiftData.date && shiftData.startTime && shiftData.endTime && shiftData.assignedEmployee);

    return (
        <>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Add New Shift
            </Button>

            <Modal open={open} onClose={handleClose} aria-labelledby="add-new-shift">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 450,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 2,
                        textAlign: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{
                        bgcolor: 'primary.main',
                        p: 2,
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Typography id="add-new-availability" variant="h6" component="h2" sx={{ fontWeight: 500 }}>
                            Add Availability
                        </Typography>
                        <Button
                            onClick={handleClose}
                            sx={{ minWidth: 'auto', p: 0.5, color: 'white' }}
                        >
                            <CloseIcon />
                        </Button>
                    </Box>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2} sx={{ p: 4 }}>
                            {/* Date Picker */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    type="date"
                                    name="date"
                                    value={shiftData.date}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <CalendarTodayIcon sx={{ mr: 1 }} />
                                    }}
                                />
                            </Grid>

                            {/* Start Time Picker */}
                            <Grid item xs={6}>
                                <MobileTimePicker
                                    label="Start Time"
                                    value={shiftData.startTime ? new Date(`${shiftData.date} ${shiftData.startTime}`) : null}
                                    onChange={(time) => handleTimeChange('startTime', time)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth margin="normal"
                                            InputProps={{
                                                startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* End Time Picker */}
                            <Grid item xs={6}>
                                <MobileTimePicker
                                    label="End Time"
                                    value={shiftData.endTime ? new Date(`${shiftData.date} ${shiftData.endTime}`) : null}
                                    onChange={(time) => handleTimeChange('endTime', time)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth margin="normal"
                                            InputProps={{
                                                startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Show message when employees are fetched but none are available */}
                            {employeesFetched && availableEmployees.length === 0 && (
                                <Grid item xs={12}>
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        No available employees for the selected time slot
                                    </Alert>
                                </Grid>
                            )}

                            {/* Employee Selection */}
                            {availableEmployees.length > 0 && (
                                <Grid item xs={12}>
                                    <Select
                                        fullWidth
                                        name="assignedEmployee"
                                        value={shiftData.assignedEmployee}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{ mt: 2 }}
                                    >
                                        <MenuItem value="" disabled>Select an Employee</MenuItem>
                                        {availableEmployees.map((employee) => (
                                            <MenuItem key={employee._id} value={employee._id}>
                                                {employee.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            )}

                            {/* Buttons */}
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
                                <Button 
                                    variant="contained" 
                                    onClick={handleSubmit} 
                                    disabled={!isSubmitEnabled}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </Box>
            </Modal>
        </>
    );
};

export default AddNewShiftModal;