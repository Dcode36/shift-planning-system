import React, { useState, useContext } from 'react';
import { TextField, Button, Card, CardContent, Typography, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await login(email, password);
            if (!res || !res.role) {
                throw new Error("Invalid response from server");
            }
            navigate(res.role === 'employee' ? '/employee' : '/admin');
        } catch (err) {
            console.error("Login failed", err);
        }
    };


    return (
        <div style={styles.container}>
            <Card sx={{ maxWidth: 400, padding: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        sx={{ marginTop: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                        Don't have an account?
                        <Link href="#" onClick={() => navigate('/register')} sx={{ marginLeft: 1 }}>
                            Register
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

export default Login;