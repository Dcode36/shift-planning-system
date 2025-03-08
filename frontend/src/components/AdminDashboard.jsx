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
    InputBase,
    IconButton,
    Backdrop,
    Fade,
    TextField,
    Modal,
    MenuItem,
    Select,
    Card,
    Divider,

} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AddNewShiftModal from './AddShiftModal';
import { Visibility } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import { Grid2 } from '@mui/material';
const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('shifts');
    const user = JSON.parse(localStorage.getItem('user'));
    const [shifts, setShifts] = useState([]);
    const [employeesAvailability, setEmployeesAvailability] = useState([]);
    console.log(user)
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
            const { data } = await axios.get(`http://localhost:4000/api/admin/all-shifts`, {
                params: { adminTimeZone: user.timeZone },
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            setShifts(data);
            console.log(data);
        } catch (error) {
            console.log(error);
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
            const { data } = await axios.get(`http://localhost:4000/api/admin/get-all-availabilities`, {
                headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
            });
            setEmployeesAvailability(data);
            console.log("hello", data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchAllAvailabilities();
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
                <AddNewShiftModal />
            </Box>
        </Box>
    );

    const handleUpdateEmployee = async (row) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return; // Prevent further execution
            }

            const { data } = await axios.put(
                `http://localhost:4000/api/admin/update-shift/${row._id}`,
                {
                    assignedEmployee: row.employeeId
                }
                , // Provide a request body if required
                {
                    headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
                }
            );

            console.log(data);
            fetchShifts();
        } catch (error) {
            console.error("Error updating employee shift:", error);
        }
    };

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
                    `http://localhost:4000/api/employee/get-available-employees`,
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
                    `http://localhost:4000/api/admin/update-shift/${selectedShift._id}`,
                    { assignedEmployee: selectedEmployee },
                    { headers: { Authorization: `${token}`, "Content-Type": "application/json" } }
                );
                fetchShifts();
                handleClose();
            } catch (error) {
                console.error("Error assigning employee:", error);
            }
        };

        return (
            <Box>
                <TableToolbar title="Employee Shifts" />
                {shifts.length > 0 ? (
                    <TableContainer component={Paper} sx={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        <Table aria-label="shifts table">
                            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Start Time</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Original Time Zone</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Admin Time Zone</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Assign</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shifts.map((row) => (
                                    <TableRow key={row._id} hover>
                                        <TableCell>{row?.assignedEmployee?.name || "Not Assigned"}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{String(row.startTime).substring(10)}</TableCell>
                                        <TableCell>{String(row.endTime).substring(10)}</TableCell>
                                        <TableCell>{row.originalTimeZone}</TableCell>
                                        <TableCell>{row.convertedTimezone}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpen(row)}>
                                                <AssignmentIndIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                        No shifts available
                    </Typography>
                )}

                {/* Modal for assigning employee */}
                <Modal open={open} onClose={handleClose}>
                    <Fade in={open}>
                        <Box sx={{
                            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                            width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Assign Employee to Shift
                            </Typography>
                            <Select
                                fullWidth
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Employee</MenuItem>
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
            </Box>
        );
    };

    const AvailabilityTable = () => {
        const [open, setOpen] = useState(false);
        const [selectedAvailability, setSelectedAvailability] = useState([]);
        const [selectedEmployee, setSelectedEmployee] = useState("");

        const handleOpen = (availability) => {
            setSelectedAvailability(availability);
            setOpen(true);
        };

        const handleClose = () => setOpen(false);

        // Filter employees based on selection (if any)
        const filteredEmployees = selectedEmployee
            ? employeesAvailability.filter(emp => emp.userName === selectedEmployee)
            : employeesAvailability;

        return (
            <Box>
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
                >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Employees Availability
                    </Typography>
                    <Select
                        name="employee"
                        value={selectedEmployee}
                        displayEmpty
                        sx={{ mt: 2 }}
                        onChange={(event) => setSelectedEmployee(event.target.value)}
                    >
                        <MenuItem value="">All Employees</MenuItem> {/* Reset filter option */}
                        {employeesAvailability?.map((row, index) => (
                            <MenuItem key={index} value={row.userName}>{row.userName}</MenuItem>
                        ))}
                    </Select>
                </Box>
                <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Table aria-label="availability table">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Time Zone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees?.map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{row.userName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.timeZone}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(row.availability)}>
                                            <Visibility />
                                        </IconButton>
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
                                <Grid2 container spacing={1}>
                                    {selectedAvailability.length > 0 ? (
                                        selectedAvailability?.map((slot, index) => (
                                            <Grid2 item xs={12} key={index}>
                                                <Card sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {slot.date}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {`${slot.startTime} - ${slot.endTime}`}
                                                    </Typography>
                                                </Card>
                                            </Grid2>
                                        ))
                                    ) : (
                                        <Typography variant="body1" textAlign="center">
                                            No availability data found.
                                        </Typography>
                                    )}
                                </Grid2>
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