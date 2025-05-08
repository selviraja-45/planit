import React, { useState } from 'react';
import API from '../api';
import AuthForm from '../components/AuthForm';
import { Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (data) => {
    setLoading(true);

    try {
      const res = await API.post('/auth/register', data);
      
      localStorage.setItem('planit-token', res.data.token);
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
