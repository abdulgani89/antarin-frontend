import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardManager from './pages/DashboardManager';
import OrderAnjem from './pages/OrderAnjem';
import OrderJastip from './pages/OrderJastip';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import History from './pages/History';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } 
      >
         <Route index element={<DashboardManager />} />
         <Route path="order/anjem" element={<OrderAnjem />} />
         <Route path="order/jastip" element={<OrderJastip />} />
         <Route path="profile" element={<Profile />} />
         <Route path="wallet" element={<Wallet />} />
         <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
