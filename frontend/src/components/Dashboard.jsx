import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card text-center shadow-lg p-4" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h2 className="card-title text-dark mb-3">Welcome to the Application</h2>
          <p className="card-text text-muted">
            This is the root page of the application and does not have content yet.
          </p>
          <p className="card-text fw-bold">You can browse to:</p>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/admin" className="btn btn-primary">Go to Admin</Link>
            <Link to="/employee" className="btn btn-success">Go to Employee</Link>
          </div>

          <p className="mt-3 text-secondary">Thank you for visiting! 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
