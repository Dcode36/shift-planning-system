# Shift Planning System

A comprehensive solution for efficiently managing employee shifts and schedules with role-based access controls and timezone support.

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Site-blue?style=for-the-badge)](https://shift-planning-system-gold.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Dcode36/shift-planning-system)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [API Documentation](#api-documentation)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [Technologies](#technologies)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

The Shift Planning System is a web-based application designed to streamline the process of managing employee shifts, availabilities, and schedules. It features a robust backend API and an intuitive frontend interface, making workforce management simpler and more efficient.

## ✨ Features

### Backend

- **🔐 Secure Authentication**: JWT-based authentication system for secure login and registration
- **📅 Shift Management**: Comprehensive CRUD operations for shift creation and management
- **👥 Employee Management**: Efficiently manage employee profiles and availability
- **👮 Role-Based Access Control**: Different permission levels for administrators and employees
- **🌐 Timezone Support**: Global compatibility with different timezones using moment-timezone
- **🔄 RESTful API**: Clean API architecture for seamless integration

### Frontend

- **📊 Interactive Dashboard**: Visual overview of shifts and employee statuses
- **📆 Shift Calendar**: Intuitive calendar interface for shift visualization
- **📋 Employee Directory**: Comprehensive employee listing with details
- **📝 Shift Assignment**: User-friendly interface for assigning shifts
- **🔔 Notification System**: Real-time alerts for shift changes and updates
- **🔒 Secure Dashboards**: Protected routes for both admin and employee dashboards

## 🏗 System Architecture

We have designed a scalable and robust system architecture for the Shift Planning System.

[View High-Level Design Document](https://app.eraser.io/workspace/VdY74MuVV59uhtxVnUVs?origin=share)

## 📚 API Documentation

Explore and test our API endpoints using Postman:

[Postman API Documentation](http://example.com/postman-link)

## 🚀 Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables (.env)
# Create a .env file with:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

# Start the server
npm start


# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables (.env)
# Create a .env file with:
# REACT_APP_API_URL=http://localhost:5000/api

# Start the development server
npm start