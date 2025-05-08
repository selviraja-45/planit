import React, { useEffect, useState } from 'react';
import API from '../api';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/auth/user')
      .then((res) => setUser(res.data))
      .catch((err) => setError('Unauthorized. Please login again.'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('planit-token');
    navigate('/login');
  };

  if (error) return <Alert className="mt-5" variant="danger">{error}</Alert>;
  if (!user) return <Spinner className="mt-5" animation="border" />;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h3>Welcome, {user.name}</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
