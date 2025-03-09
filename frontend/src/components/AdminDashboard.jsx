import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
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
    FormControl,
    InputLabel,
    Chip,
    Grid,
    Tooltip,
    Badge,
    Avatar
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddNewShiftModal from './AddShiftModal';
import {
    Visibility,
    EventAvailable,
    Schedule,
    CalendarMonth,
    AccessTime,
    Person,
    Email,
    Language,
    Close,
    DoNotDisturbAlt,
    CheckCircle
} from '@mui/icons-material';

import DeleteIcon from '@mui/icons-material/Delete';
const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('shifts');
    const user = JSON.parse(localStorage.getItem('user'));
    const [shifts, setShifts] = useState([]);
    const [employeesAvailability, setEmployeesAvailability] = useState([]);

    // Set active tab based on URL when component mounts
    useEffect(() => {
        // Check if path includes "availability"
        if (location.pathname.includes('availability')) {
            setActiveTab('availability');
        } else {
            setActiveTab('shifts');
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/admin?tab=${tab}`);
    };

    const fetchShifts = async () => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admin/all-shifts`, {
                params: { adminTimeZone: user.timeZone },
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            setShifts(data);
        } catch (error) {
            console.error(error);
        } 
    }

    useEffect(() => {
        fetchShifts();
    }, [])

    const fetchAllAvailabilities = async () => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admin/get-all-availabilities`, {
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            setEmployeesAvailability(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAllAvailabilities();
    }, [])

    const handleDelete = async (shift) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/admin/delete-shift/${shift._id}`, {
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            fetchShifts();
        } catch (error) {
            console.error('Error deleting shift:', error);
        }
    }

    const CustomTab = ({ name, label, isActive, icon }) => (
        <Button
            onClick={() => handleTabChange(name)}
            startIcon={icon}
            sx={{
                fontSize: '16px',
                fontWeight: isActive ? '600' : 'normal',
                color: isActive ? 'primary.main' : 'text.secondary',
                borderBottom: isActive ? '3px solid' : '3px solid transparent',
                borderRadius: 0,
                padding: '15px 25px',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    borderBottom: isActive ? '3px solid' : '3px solid rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            {label}
        </Button>
    );

    const TableToolbar = ({ title, subtitle }) => (
        <Box sx={{ mb: 3 }}>



            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mt: 2 }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: '600', mb: 0.5 }}>
                    {title}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {subtitle}
                    </Typography>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <AddNewShiftModal />
                </Box>
            </Box>
        </Box>
    );

    const ShiftsTable = () => {
        const [open, setOpen] = useState(false);
        const [selectedShift, setSelectedShift] = useState(null);
        const [availableEmployees, setAvailableEmployees] = useState([]);
        const [selectedEmployee, setSelectedEmployee] = useState("");

        const handleOpen = async (shift) => {
            setSelectedShift(shift);
            setOpen(true);
            await fetchAvailableEmployees(shift);
        };

        const handleClose = () => {
            setOpen(false);
            setSelectedEmployee("");
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

        // Format time function
        const formatTime = (timeString) => {
            if (!timeString) return '';
            const time = timeString.substring(10).trim();
            return time;
        };

        return (
            <Box>
                <TableToolbar
                    title="Employee Shifts"
                    subtitle={`${shifts.length} total shifts in ${user.timeZone} timezone`}
                />
                {shifts.length > 0 ? (
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                            borderRadius: 2,
                            overflow: "scroll",
                            maxHeight: 500,
                        }}
                    >
                        <Table aria-label="shifts table" >
                            <TableHead sx={{ backgroundColor: "#f5f7fa", position: 'sticky' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "600", py: 2 }}>Employee</TableCell>
                                    <TableCell sx={{ fontWeight: "600", py: 2 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: "600", py: 2 }}>Start Time</TableCell>
                                    <TableCell sx={{ fontWeight: "600", py: 2 }}>End Time</TableCell>
                                    <TableCell sx={{ fontWeight: "600", py: 2 }}>Original Time Zone</TableCell>
                                    <TableCell sx={{ fontWeight: "600", py: 2 }}>Admin Time Zone</TableCell>
                                    <TableCell sx={{ fontWeight: "600", py: 2 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shifts.map((row) => (
                                    <TableRow key={row._id} hover>
                                        <TableCell>
                                            {row?.assignedEmployee?.name ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: 'primary.main',
                                                            mr: 1,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {row.assignedEmployee.name.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {row.assignedEmployee.name}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Chip
                                                    icon={<DoNotDisturbAlt fontSize="small" />}
                                                    label="Not Assigned"
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarMonth
                                                    fontSize="small"
                                                    sx={{ color: 'text.secondary', mr: 1 }}
                                                />
                                                {row.date}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTime
                                                    fontSize="small"
                                                    sx={{ color: 'text.secondary', mr: 1 }}
                                                />
                                                {formatTime(row.startTime)}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTime
                                                    fontSize="small"
                                                    sx={{ color: 'text.secondary', mr: 1 }}
                                                />
                                                {formatTime(row.endTime)}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={row.originalTimeZone}
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={row.convertedTimezone}
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Delete">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDelete(row)}
                                                    sx={{
                                                        textTransform: 'none',
                                                        borderRadius: 1.5,
                                                        color: 'red',
                                                        borderColor: 'red',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                            borderColor: 'darkred'
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Tooltip>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 2,
                            bgcolor: '#f9fafb'
                        }}
                    >
                        <Schedule sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No Shifts Available
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Create a new shift to get started with employee scheduling
                        </Typography>
                        <AddNewShiftModal />
                    </Paper>
                )}

                {/* Modal for assigning employee */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={open}>
                        <Box sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 450,
                            bgcolor: "background.paper",
                            borderRadius: 2,
                            boxShadow: 24,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                p: 2,
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6">
                                    <AssignmentIndIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Assign Employee to Shift
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleClose}
                                    sx={{ color: 'white' }}
                                >
                                    <Close />
                                </IconButton>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {selectedShift && (
                                    <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f7fa', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Shift Details
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Date</Typography>
                                                <Typography variant="body1">{selectedShift.date}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Time</Typography>
                                                <Typography variant="body1">
                                                    {formatTime(selectedShift.startTime)} - {formatTime(selectedShift.endTime)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel id="select-employee-label">Select Employee</InputLabel>
                                    <Select
                                        labelId="select-employee-label"
                                        id="select-employee"
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        label="Select Employee"
                                    >
                                        <MenuItem value="" disabled>Select Employee</MenuItem>
                                        {availableEmployees.map((employee, index) => (
                                            <MenuItem key={index} value={employee._id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            bgcolor: 'primary.main',
                                                            mr: 1,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {employee.name.charAt(0)}
                                                    </Avatar>
                                                    {employee.name}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleClose}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleAssignEmployee}
                                        disabled={!selectedEmployee}
                                        startIcon={<CheckCircle />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Confirm Assignment
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        );
    };

    const AvailabilityTable = () => {
        const [open, setOpen] = useState(false);
        const [selectedAvailability, setSelectedAvailability] = useState([]);
        const [selectedEmployee, setSelectedEmployee] = useState("");
        const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);

        const handleOpen = (availability, employee) => {
            setSelectedAvailability(availability);
            setSelectedEmployeeDetails(employee);
            setOpen(true);
        };

        const handleClose = () => setOpen(false);

        // Filter employees based on selection (if any)
        const filteredEmployees = selectedEmployee
            ? employeesAvailability.filter(emp => emp.userName === selectedEmployee)
            : employeesAvailability;

        return (
            <Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="body1">
                        <Badge
                            badgeContent={filteredEmployees.length}
                            color="primary"
                            sx={{ mr: 1 }}
                        >
                            <Person />
                        </Badge>
                        {selectedEmployee ? `Showing availability for ${selectedEmployee}` : 'Showing all employees'}
                    </Typography>

                    <FormControl sx={{ minWidth: 200 }} size="small">
                        <InputLabel id="filter-employee-label">Filter by Employee</InputLabel>
                        <Select
                            labelId="filter-employee-label"
                            id="filter-employee"
                            value={selectedEmployee}
                            label="Filter by Employee"
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                        >
                            <MenuItem value="">All Employees</MenuItem>
                            {employeesAvailability?.map((row, index) => (
                                <MenuItem key={index} value={row.userName}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                bgcolor: 'primary.main',
                                                mr: 1,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {row.userName.charAt(0)}
                                        </Avatar>
                                        {row.userName}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer
                    component={Paper}
                    sx={{
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        borderRadius: 2,
                        overflow: "hidden"
                    }}
                >
                    <Table aria-label="availability table">
                        <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "600", py: 2 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: "600", py: 2 }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: "600", py: 2 }}>Time Zone</TableCell>
                                <TableCell sx={{ fontWeight: "600", py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EventAvailable sx={{ mr: 0.5 }} fontSize="small" />
                                        Available Slots
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: "600", py: 2 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees?.map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: 'primary.main',
                                                    mr: 1,
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {row.userName.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body2">
                                                {row.userName}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Email
                                                fontSize="small"
                                                sx={{ color: 'text.secondary', mr: 1 }}
                                            />
                                            {row.email}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Language
                                                fontSize="small"
                                                sx={{ color: 'text.secondary', mr: 1 }}
                                            />
                                            <Chip
                                                size="small"
                                                label={row.timeZone}
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${row.availability.length} slots`}
                                            color={row.availability.length > 0 ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => handleOpen(row.availability, row)}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 1.5
                                            }}
                                            disabled={row.availability.length === 0}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

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
                                width: 500,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{
                                p: 2,
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6">
                                    <EventAvailable sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Availability Details
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleClose}
                                    sx={{ color: 'white' }}
                                >
                                    <Close />
                                </IconButton>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {selectedEmployeeDetails && (
                                    <Box sx={{
                                        mb: 3,
                                        p: 2.5,
                                        bgcolor: '#f5f7fa',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: 'primary.main',
                                                mr: 2,
                                                fontSize: '1.25rem'
                                            }}
                                        >
                                            {selectedEmployeeDetails.userName.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6">
                                                {selectedEmployeeDetails.userName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedEmployeeDetails.email} • {selectedEmployeeDetails.timeZone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Available Time Slots
                                </Typography>

                                <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
                                    {selectedAvailability.length > 0 ? (
                                        selectedAvailability?.map((slot, index) => (
                                            <Card
                                                key={index}
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    mb: 1.5,
                                                    borderRadius: 1.5,
                                                    transition: '0.2s',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarMonth
                                                        fontSize="small"
                                                        sx={{ color: 'primary.main', mr: 1 }}
                                                    />
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {slot.date}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AccessTime
                                                        fontSize="small"
                                                        sx={{ color: 'text.secondary', mr: 1 }}
                                                    />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {`${slot.startTime} - ${slot.endTime}`}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        ))
                                    ) : (
                                        <Box sx={{
                                            py: 4,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#f9fafb',
                                            borderRadius: 2
                                        }}>
                                            <DoNotDisturbAlt sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body1" color="text.secondary" align="center">
                                                No availability data found.
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleClose}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            </Box>
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
                    <CustomTab name="shifts" label="Shifts" isActive={activeTab === 'shifts'} />
                    <CustomTab name="availability" label="Availability" isActive={activeTab === 'availability'} />
                </Box>
                <Box>
                    {activeTab === 'shifts' ? <ShiftsTable /> : <AvailabilityTable />}
                </Box>
            </Box>
        </div>
    );
};

export default AdminDashboard;