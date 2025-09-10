import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from './Layout';
import Dashboard from './Dashbaord';
import Bookings from './Booking';
import Cart from './Cart';
import Address from './Address';
import AccountDetails from './AccountDetails';
import ChangePassword from './ChangePassword';
import Login from '../Login/Login';
import Profile from '../Dashboard/Profile';

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Get logged-in user from Redux store
  const { user } = useSelector((state) => state.auth);
  console.log(user)

  const renderContent = () => {
    switch (activeTab) {
      case 'Account login':
        return <Login user={user} />;
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'bookings':
        return <Bookings />;
      case 'cart':
        return <Cart />;
      case 'address':
        return <Address user={user} />;
      case 'account':
        return <AccountDetails user={user} />;
      case 'password':
        return <ChangePassword />;
        case 'profile':
  return <Profile user={user} />;

      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default DashboardOverview;
