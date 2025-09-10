import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import {
  HouseDoor,
  Calendar,
  Cart,
  GeoAlt,
  Person,
  Key,
  BoxArrowLeft,
  List,
  X
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Header */}
      <div className="d-md-none d-flex justify-content-between align-items-center p-2 bg-success">
        <h5 className="mb-0 text-white">My Accounts</h5>
        <Button
          variant="outline-light"
          onClick={toggleMobileMenu}
          className="p-1"
        >
          {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
        </Button>
      </div>

      <Container fluid className="dashboard-container">
        <Row>
          {/* Sidebar */}
          <Col
            md={3}
            lg={2}
            className={`sidebar p-0 ${mobileMenuOpen ? 'mobile-menu-open' : 'd-none d-md-block'}`}
          >
            <div className="sidebar-header bg-success text-white p-3">
              <h4 className="mb-0">My Accounts</h4>
            </div>

            <Nav className="flex-column sidebar-nav">
              <Nav.Link
                active={activeTab === 'dashboard'}
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="d-flex align-items-center"
              >
                <HouseDoor className="me-2" /> Dashboard
              </Nav.Link>

              <Nav.Link
                active={activeTab === 'bookings'}
                onClick={() => {
                  setActiveTab('bookings');
                  setMobileMenuOpen(false);
                }}
                className="d-flex align-items-center"
              >
                <Calendar className="me-2" /> All Orders
              </Nav.Link>

              <Nav.Link
                active={activeTab === 'cart'}
                onClick={() => {
                  setActiveTab('cart');
                  setMobileMenuOpen(false);
                }}
                className="d-flex align-items-center"
              >
                <Cart className="me-2" /> Cart
              </Nav.Link>

              <Nav.Link
                active={activeTab === 'address'}
                onClick={() => {
                  setActiveTab('address');
                  setMobileMenuOpen(false);
                }}
                className="d-flex align-items-center"
              >
                <GeoAlt className="me-2" /> My Address
              </Nav.Link>

              <Nav.Link
                active={activeTab === 'account'}
                onClick={() => {
                  setActiveTab('account');
                  setMobileMenuOpen(false);
                }}
                className="d-flex align-items-center"
              >
                <Person className="me-2" /> Account Details
              </Nav.Link>

              <Nav.Link
                active={activeTab === 'profile'}
                onClick={() => {
                  setActiveTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="d-flex align-items-center"
              >
                <Person className="me-2" /> Profile
              </Nav.Link>

              <Nav.Link
                active={activeTab === 'password'}
                onClick={() => {
                  setActiveTab('password');
                  setMobileMenuOpen(false);
                }}
                className="d-flex align-items-center"
              >
                <Key className="me-2" /> Change Password
              </Nav.Link>

              <Nav.Link
                onClick={handleLogout}
                className="d-flex align-items-center"
              >
                <BoxArrowLeft className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="main-content p-4">
            {children}
          </Col>
        </Row>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        .sidebar {
          background-color: white;
          min-height: 100vh;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 100;
        }
        .sidebar-nav .nav-link {
          color: #495057;
          padding: 12px 20px;
          border-left: 3px solid transparent;
          transition: all 0.3s;
        }
        .sidebar-nav .nav-link:hover {
          background-color: #e9f5ee;
          color: #198754;
        }
        .sidebar-nav .nav-link.active {
          background-color: #e9f5ee;
          color: #198754;
          border-left: 3px solid #198754;
          font-weight: 500;
        }
        @media (max-width: 767.98px) {
          .mobile-menu-open {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1050;
            overflow-y: auto;
            background-color: white;
          }
          .main-content {
            padding-top: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
