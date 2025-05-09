import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import API from '../../api';

function JoinTripForm() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/trips/join/${code}`);
      setMessage(res.data.message);
      setError(null);
      setCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join trip');
      setMessage(null);
    }
  };

  return (
    <Form onSubmit={handleJoin} className="mt-4">
      <Form.Group controlId="tripCode">
        <Form.Label>Join a Trip using Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Trip Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit" className="mt-2">Join Trip</Button>
      {message && <Alert variant="success" className="mt-2">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
    </Form>
  );
}

export default JoinTripForm;