import React, { useState } from 'react';
import API from '../api';
import AuthForm from '../components/AuthForm';
import { Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ensure correct import

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerUser = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', data);
      login(res.data.user, res.data.token); // use context login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      {error && <Alert variant="danger">{error}</Alert>}
      <AuthForm title="Register" onSubmit={registerUser} loading={loading} />
    </Container>
  );
};

export default RegisterPage;
