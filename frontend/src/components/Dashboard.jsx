import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider } from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    Update as UpdateIcon,
    Public as PublicIcon,
    SwapHoriz as SwapHorizIcon,
    BarChart as BarChartIcon
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, description }) => (
    <Card elevation={2} sx={{ height: '100%', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
        <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
                {icon}
                <Typography variant="h6" fontWeight="bold" ml={1}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    return (
        <Box sx={{
            bgcolor: '#f5f7fa',
            minHeight: '100vh',
            p: { xs: 2, md: 4 }
        }}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    maxWidth: 1200,
                    mx: 'auto'
                }}
            >
                {/* Header */}
                <Box sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 4,
                    position: 'relative',
                    backgroundImage: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)'
                }}>
                    <Typography variant="h3" fontWeight="bold" mb={2}>
                        System Shift Planning Dashboard
                    </Typography>
                    <Typography variant="h6" fontWeight="normal" sx={{ maxWidth: 800, opacity: 0.9 }}>
                        Streamline your workforce management with our intelligent shift planning solution
                    </Typography>
                </Box>

                {/* Main Content */}
                <Box p={4}>
                    {/* Welcome Message */}
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                        Welcome to the System Shift Planning Dashboard! Our system is designed to help organizations
                        efficiently manage employee shifts, ensuring smooth operations and optimal workforce allocation.
                    </Typography>

                    <Typography variant="h5" fontWeight="bold" mt={4} mb={3}>
                        Key Features
                    </Typography>

                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard
                                icon={<AccessTimeIcon fontSize="large" color="primary" />}
                                title="Automated Scheduling"
                                description="Our system intelligently assigns shifts based on employee availability, skills, and workload requirements."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard
                                icon={<UpdateIcon fontSize="large" color="primary" />}
                                title="Real-time Updates"
                                description="Employees can check their shift schedules in real time, reducing confusion and last-minute changes."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard
                                icon={<PublicIcon fontSize="large" color="primary" />}
                                title="Timezone Support"
                                description="The dashboard displays shift timings based on the user's timezone for seamless coordination across locations."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard
                                icon={<SwapHorizIcon fontSize="large" color="primary" />}
                                title="Shift Modification & Swapping"
                                description="Employees can request shift changes, and managers can approve or modify schedules with just a few clicks."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FeatureCard
                                icon={<BarChartIcon fontSize="large" color="primary" />}
                                title="Performance Analytics"
                                description="Gain insights into employee shift patterns, productivity, and work hours through comprehensive visual reports."
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 2, mt: 2 }}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                            Why Use Our System?
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                            Our shift planning tool minimizes scheduling conflicts, optimizes workforce distribution, and enhances operational efficiency.
                            Whether you're managing a small team or a large organization, our dashboard provides the flexibility and automation needed
                            to streamline shift planning and boost productivity across your entire operation.
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Dashboard;