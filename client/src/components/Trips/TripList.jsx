import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import TripDetails from './TripDetails';

const TripList = () => {
  const [trips, setTrips] = useState({ createdTrips: [], invitedTrips: [] });
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    try {
      const res = await axios.get('/api/trips', {
        headers: { Authorization: `Bearer ${localStorage.getItem('plantit-token')}` },
      });
      setTrips(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch trips');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) return <Spinner animation="border" />;

  if (selectedTrip) {
    return (
      <TripDetails
        tripId={selectedTrip}
        onBack={() => setSelectedTrip(null)}
      />
    );
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <h4>Your Trips</h4>
      <Row>
        {[...trips.createdTrips, ...trips.invitedTrips].map((trip) => (
          <Col md={4} key={trip._id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{trip.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </Card.Subtitle>
                {trip.budget && <Card.Text>Budget: ₹{trip.budget}</Card.Text>}
                <Button variant="info" onClick={() => setSelectedTrip(trip._id)}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default TripList;
