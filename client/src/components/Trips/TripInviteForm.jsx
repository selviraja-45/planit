import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import API from '../../api';

function TripInviteForm({ tripId }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/trips/${tripId}/invite`, { email });
      setMessage(res.data.message);
      setError(null);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error inviting user');
      setMessage(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <Form.Group controlId="inviteEmail">
        <Form.Label>Invite by Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit" className="mt-2">Send Invite</Button>
      {message && <Alert variant="success" className="mt-2">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
    </Form>
  );
}

export default TripInviteForm;