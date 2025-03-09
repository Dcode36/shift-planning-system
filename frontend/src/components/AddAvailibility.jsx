import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckIcon from '@mui/icons-material/Check';

const AddAvailability = () => {
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user')) || { timeZone: 'America/New_York' };
    const [shiftData, setShiftData] = useState({
        date: '',
        startTime: null,
        endTime: null,
        timeZone: user.timeZone
    });
    const [errors, setErrors] = useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setShiftData({ date: '', startTime: null, endTime: null, timeZone: user.timeZone });
        setErrors({});
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShiftData({ ...shiftData, [name]: value });
        
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!shiftData.date) newErrors.date = "Date is required";
        if (!shiftData.startTime) newErrors.startTime = "Start time is required";
        if (!shiftData.endTime) newErrors.endTime = "End time is required";
        
        // Check if end time is after start time
        if (shiftData.startTime && shiftData.endTime) {
            const start = new Date(`${shiftData.date} ${shiftData.startTime}`);
            const end = new Date(`${shiftData.date} ${shiftData.endTime}`);
            
            if (end <= start) {
                newErrors.endTime = "End time must be after start time";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTimeChange = (name, time) => {
        if (!time) return;
        const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        setShiftData((prev) => ({ ...prev, [name]: formattedTime }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async () => {
        
        try {
            if (!shiftData.date || !shiftData.startTime || !shiftData.endTime ) {
                return alert("Please fill all fields before submitting.");
            }
            const token = localStorage.getItem('token');

            const res = await axios.post(`http://localhost:4000/api/employee/create-availability`, shiftData, {
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });

            if (res.status === 201) {
                alert("Availability added successfully");
                handleClose();
                window.location.reload();
            }
        } catch (error) {
            console.error("Error creating availability:", error);
        }
    };

    return (
        <>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleOpen}
                sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    borderRadius: '8px',
                    boxShadow: 2,
                    textTransform: 'none',
                    fontWeight: 500
                }}
            >
                Add New Availability
            </Button>

            <Modal 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="add-new-availability"
                sx={{ backdropFilter: 'blur(2px)' }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 450,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 0,
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ 
                        bgcolor: 'primary.main', 
                        p: 2, 
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
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

                    {/* Form Content */}
                    <Box sx={{ p: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            {/* Step 1: Select Date */}
                            <Box sx={{ mb: 2.5 }}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                    Date <Typography component="span" color="error">*</Typography>
                                </Typography>
                                <Box sx={{ position: 'relative' }}>
                                    <CalendarTodayIcon sx={{ 
                                        position: 'absolute', 
                                        left: 10, 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        color: 'text.secondary',
                                        fontSize: 20
                                    }} />
                                    <TextField
                                        fullWidth
                                        type="date"
                                        name="date"
                                        value={shiftData.date}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        error={Boolean(errors.date)}
                                        helperText={errors.date}
                                        InputProps={{
                                            sx: { pl: 4.5 }
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Time Picker Row */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                                {/* Step 2: Select Start Time */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                        Start Time <Typography component="span" color="error">*</Typography>
                                    </Typography>
                                    <Box sx={{ position: 'relative' }}>

                                        <MobileTimePicker
                                            value={shiftData.startTime ? new Date(`${shiftData.date || '2023-01-01'} ${shiftData.startTime}`) : null}
                                            onChange={(time) => handleTimeChange('startTime', time)}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    fullWidth 
                                                    size="small"
                                                    error={Boolean(errors.startTime)}
                                                    helperText={errors.startTime}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        sx: { pl: 4.5 }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>

                                {/* Step 3: Select End Time */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                        End Time <Typography component="span" color="error">*</Typography>
                                    </Typography>
                                    <Box sx={{ position: 'relative' }}>
                                        <MobileTimePicker
                                            value={shiftData.endTime ? new Date(`${shiftData.date || '2023-01-01'} ${shiftData.endTime}`) : null}
                                            onChange={(time) => handleTimeChange('endTime', time)}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    fullWidth 
                                                    size="small"
                                                    error={Boolean(errors.endTime)}
                                                    helperText={errors.endTime}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        sx: { pl: 4.5 }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </LocalizationProvider>

                        {/* Timezone Info */}
                        <Box sx={{ 
                            mt: 2,
                            mb: 3,
                            p: 1.5, 
                            bgcolor: 'primary.lighter', 
                            borderRadius: 1, 
                            display: 'flex', 
                            alignItems: 'flex-start'
                        }}>
                            <InfoIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                            <Typography variant="body2" color="primary.main">
                                Times will be saved in your current timezone: <b>{user.timeZone}</b>
                            </Typography>
                        </Box>

                        {/* Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                            <Button 
                                onClick={handleClose}
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleSubmit}
                                startIcon={<CheckIcon />}
                                sx={{ textTransform: 'none', fontWeight: 500 }}
                            >
                                Submit Availability
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddAvailability;