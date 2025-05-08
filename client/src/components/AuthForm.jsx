import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const AuthForm = ({ title, onSubmit, loading }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit(form);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="mb-4">{title}</h2>

      {title === 'Register' && (
        <Form.Group className="mb-3">
          <Form.Label size="sm">Name</Form.Label>
          <Form.Control name="name" onChange={handleChange} required />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label size="sm">Email</Form.Label>
        <Form.Control type="email" name="email" onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label size="sm">Password</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} required />
      </Form.Group>

      <Button type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : title}
      </Button>
    </Form>
  );
};

export default AuthForm;
