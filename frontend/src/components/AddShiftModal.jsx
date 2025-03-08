import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddNewShiftModal = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [shiftData, setShiftData] = useState({
        date: '',
        startTime: null,
        endTime: null,
        timeZone: '',
        assignedEmployee: ''
    });
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setShiftData({ date: '', startTime: null, endTime: null, timeZone: '', assignedEmployee: '' });
        setAvailableEmployees([]);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShiftData({ ...shiftData, [name]: value });
    };

    const handleTimeChange = (name, time) => {
        setShiftData((prev) => ({ ...prev, [name]: time }));
    };

    const fetchAvailableEmployees = async () => {
        if (!shiftData.date || !shiftData.startTime || !shiftData.endTime || !shiftData.timeZone) {
            return alert("Please select date, start time, end time, and time zone first.");
        }

        setIsFetching(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:4000/api/employee/get-available-employees`, {
                params: {
                    date: shiftData.date,
                    startTime: shiftData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                    endTime: shiftData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                    timeZone: shiftData.timeZone
                },
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            setAvailableEmployees(data);
        } catch (error) {
            console.error("Error fetching available employees:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!shiftData.date || !shiftData.startTime || !shiftData.endTime || !shiftData.timeZone) {
                return alert("Please fill all fields before submitting.");
            }
            const token = localStorage.getItem('token');

            const res = await axios.post(`http://localhost:4000/api/admin/create-shift`, {
                ...shiftData,
                startTime: shiftData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                endTime: shiftData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            }, {
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            if (res.status === 201) {
                alert("Shift created successfully");
                handleClose();
            }
            console.log(res.data);
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
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}
                >
                    <Typography id="add-new-shift" variant="h6" component="h2">
                        Add New Shift
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {/* Step 1: Select Date */}
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            name="date"
                            value={shiftData.date}
                            onChange={handleChange}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />

                        {/* Step 2: Select Start Time */}
                        <MobileTimePicker
                            label="Start Time"
                            value={shiftData.startTime}
                            onChange={(time) => handleTimeChange('startTime', time)}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal"
                            />}
                            sx={{ width: '100%', mt: 1 }}
                        />

                        {/* Step 3: Select End Time */}
                        <MobileTimePicker
                            label="End Time"
                            value={shiftData.endTime}
                            onChange={(time) => handleTimeChange('endTime', time)}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                            sx={{ width: '100%', mt: 2 }}
                        />
                    </LocalizationProvider>

                    {/* Step 4: Select Time Zone */}
                    <Select
                        fullWidth
                        name="timeZone"
                        value={shiftData.timeZone}
                        onChange={handleChange}
                        displayEmpty
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Select Time Zone</MenuItem>
                        <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                        <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                        <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                    </Select>

                    {/* Step 5: Fetch Available Employees */}
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={fetchAvailableEmployees}
                        disabled={!shiftData.date || !shiftData.startTime || !shiftData.endTime || !shiftData.timeZone || isFetching}
                        sx={{ mt: 2 }}
                    >
                        {isFetching ? "Fetching..." : "Get Available Employees"}
                    </Button>

                    {/* Step 6: Select Employee */}
                    {availableEmployees.length > 0 ? (
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
                    ) : (
                        <Typography variant="body2" textAlign="center" sx={{ mt: 2, color: "red" }}>{availableEmployees.message}</Typography>
                    )}

                    {/* Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddNewShiftModal;
