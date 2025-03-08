import React from 'react';
import { Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container
            maxWidth="md"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}
        >
            <Typography variant="h1" color="rgb(240, 191, 76)" fontWeight="bold">
                404
            </Typography>
            <Typography variant="h5" color="textSecondary" sx={{ mt: 2 }}>
                Oops! Page Not Found
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
                The page you're looking for doesn't exist or has been moved. <Link to="/">Go back</Link> to the homepage.
            </Typography>
        </Container>
    );
};

export default NotFoundPage;
