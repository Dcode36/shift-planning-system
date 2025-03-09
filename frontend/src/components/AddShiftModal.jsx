import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, Select, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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


    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setShiftData({ date: '', startTime: null, endTime: null, timeZone: user.timeZone, assignedEmployee: '' });
        setAvailableEmployees([]);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShiftData({ ...shiftData, [name]: value });
    };

    const handleTimeChange = (name, time) => {
        if (!time) return;
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

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/employee/get-available-employees`, {
                params: shiftData,
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            setAvailableEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!shiftData.date || !shiftData.startTime || !shiftData.endTime) {
                return alert("Please fill all fields before submitting.");
            }
            const token = localStorage.getItem('token');

            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/admin/create-shift`, shiftData, {
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });

            if (res.status === 201) {
                alert("Shift created successfully");
                handleClose();
                window.location.reload();
            }
        } catch (error) {
            console.error("Error creating shift:", error);
        }
    };

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
                        p: 4,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Add New Shift
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2}>
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
                                <Button variant="contained" onClick={handleSubmit}>
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
