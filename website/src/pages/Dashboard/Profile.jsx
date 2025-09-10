import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user)
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect if not logged in
    }
  }, [user, navigate]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="mb-4">My Profile</h2>
            <p><strong>Name:</strong> {user?.name || user?.user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            {user.role && <p><strong>Role:</strong> {user.role}</p>}
            {/* Add more fields based on what's in your user object */}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
