import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import API from '../../api'; // Adjust path based on your file structure

function TripFormModal({ show, handleClose, onTripCreated }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/trips', {
        name,
        startDate,
        endDate,
        budget,
      });

      console.log("Data from Trip creation modal: ", data);

      onTripCreated(data); // Refresh trip list

      console.log("Passed onTripCreated");

      handleClose(); // Close modal

      console.log("Passed modal close");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create trip');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Trip Name</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Budget</Form.Label>
            <Form.Control
              type="number"
              value={budget}
              onChange={e => setBudget(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">Create</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TripFormModal;
