import React from 'react';
import { useAuth } from '../store/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import DriverDashboard from './DriverDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardManager: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }
  
  if (user?.role === 'DRIVER') {
    return <DriverDashboard />;
  }

  // Default to customer
  return <CustomerDashboard />;
};

export default DashboardManager;
