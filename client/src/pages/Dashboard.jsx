import { useEffect, useState } from 'react';
import { Button, Container, ListGroup, Spinner, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import TripFormModal from '../components/Trips/TripFormModal';
import TripInviteForm from '../components/Trips/TripInviteForm';
import JoinTripForm from '../components/Trips/JoinTripForm';
import API from '../api';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('planit-token');
    navigate('/login');
  };

  return (
    <Button variant="outline-danger" onClick={handleLogout} className="ms-auto">
      Logout
    </Button>
  );
}

function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/trips', { withCredentials: true });
      setTrips([...data.createdTrips, ...data.invitedTrips]);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <Container className="mt-4">
      <p>Welcome to Your Dashboard</p>
      <Row className="my-3">
        <Col>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Trip</Button>
        </Col>
        <Col>
          <Button variant="secondary" onClick={() => setShowJoinModal(true)}>Join Trip</Button>
        </Col>
        <Col>
          <Button
            variant="warning"
            onClick={() => {
              const ownTrips = trips.filter(trip => trip.isCreator); // assume flag from backend
              if (ownTrips.length > 0) {
                setSelectedTripId(ownTrips[0]._id); // or open a select modal if needed
                setShowInviteModal(true);
              } else {
                alert("You need to create a trip first.");
              }
            }}
          >
            Invite to Trip
          </Button>
        </Col>
      </Row>

      {/* Create Trip Modal */}
      <TripFormModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onTripCreated={fetchTrips}
      />

      {/* Invite Modal */}
      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invite to Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TripInviteForm tripId={selectedTripId} />
        </Modal.Body>
      </Modal>

      {/* Join Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join a Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <JoinTripForm />
        </Modal.Body>
      </Modal>

      <h4 className="mt-4">Your Trips</h4>
      {loading ? (
        <Spinner animation="border" />
      ) : trips.length === 0 ? (
        <p>You have no trips.</p>
      ) : (
        <ListGroup>
          {trips.map(trip => (
            <ListGroup.Item key={trip._id} onClick={() => handleTripClick(trip._id)} action>
              {trip.name} ({trip.startDate?.slice(0, 10)} → {trip.endDate?.slice(0, 10)})
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default DashboardPage;
