import React, { useState, useContext } from 'react';
import { TextField, Button, Card, CardContent, Typography, Link, CircularProgress, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment-timezone';

const Register = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        timeZone: moment.tz.guess()
    });
    const { register, loading, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await register(userData);
            navigate('/login'); // Redirect user after successful registration
        } catch (error) {
            console.error("Registration failed", error);
        }
    };


    const timeZones = moment.tz.names();

    return (
        <div style={styles.container}>
            <Card sx={{ maxWidth: 400, padding: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Register
                    </Typography>
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        margin="normal"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Role"
                        variant="outlined"
                        margin="normal"
                        value={userData.role}
                        onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                    >
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Time Zone"
                        variant="outlined"
                        margin="normal"
                        value={userData.timeZone}
                        onChange={(e) => setUserData({ ...userData, timeZone: e.target.value })}
                    >
                        {timeZones.map((zone) => (
                            <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                        ))}
                    </TextField>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        sx={{ marginTop: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                        Already have an account?
                        <Link href="#" onClick={() => navigate('/login')} sx={{ marginLeft: 1 }}>
                            Login
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
    }
};

export default Register;