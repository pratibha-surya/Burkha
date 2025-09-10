import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import axios from 'axios';

const AccountDetails = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    firmName: '',
    address: '',
    phone: '',
    email: '',
    id: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const cartItems = useSelector(state => state.mycart.cart);

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      const u = userData.user;

      setFormData({
        firstName: u?.firstName || '',
        firmName: u?.firmName || '',
        address: u?.address || '',
        phone: u?.mobile1 || '',
        email: u?.email || '',
        id: u?._id || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
    setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token'); // if needed
      const response = await axios.put(
  `http://localhost:8080/user/users/${formData.id}`, // ✅ Corrected localhost spelling
  {
    firstName: formData.firstName,
    address: formData.address,
    mobile1: formData.phone,
    email: formData.email
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

      // Update localStorage (optional)
      localStorage.setItem("user", JSON.stringify({ user: response.data }));

      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const { firstName, firmName, address, phone, email } = formData;

  return (
    <div>
      <h3 className="account-details-heading mb-4">Account Details</h3>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Personal Information</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firmName"
                    value={firmName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>



                

                {!isEditing ? (
                  <Button variant="primary" onClick={handleEditToggle}>Edit</Button>
                ) : (
                  <div className="d-flex gap-2">
                    <Button variant="success" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Spinner size="sm" animation="border" /> : "Save"}
                    </Button>
                    <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

       
      </Row>
    </div>
  );
};

export default AccountDetails;
