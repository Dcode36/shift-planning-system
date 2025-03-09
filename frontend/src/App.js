import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './components/NotFoundPage';
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFoundPage />} />

        <Route element={<PrivateRoute allowedRoles={['admin', 'employee']} />}>
          <Route path='/' element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path='/admin' element={<AdminDashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['employee']} />}>
          <Route path='/employee' element={<EmployeeDashboard />} />
        </Route>
      </Routes>

    </>

  );
};

export default App;
