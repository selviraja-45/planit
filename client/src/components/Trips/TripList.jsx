// components/Trips/TripList.js
import React from 'react';
import { Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';

const TripList = ({ trips, loading, onTripClick, error }) => {
  if (loading) return <Spinner animation="border" />;

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <h4>Your Trips</h4>
      <Row>
        {trips.length === 0 ? (
          <p>You have no trips.</p>
        ) : (
          trips.map((trip) => (
            <Col md={4} key={trip._id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{trip.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                  </Card.Subtitle>
                  {trip.budget && <Card.Text>Budget: ₹{trip.budget}</Card.Text>}
                  <Button variant="info" onClick={() => onTripClick(trip._id)}>View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </>
  );
};

export default TripList;
