// pages/DashboardPage.js
import { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import TripFormModal from '../components/Trips/TripFormModal';
import TripInviteForm from '../components/Trips/TripInviteForm';
import JoinTripForm from '../components/Trips/JoinTripForm';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';
import TripList from '../components/Trips/TripList';  // ✅ Import TripList

function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [createdTrips, setCreatedTrips] = useState([]);
  const [invitedTrips, setInvitedTrips] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/trips', { withCredentials: true });
      setCreatedTrips(data.createdTrips || []);
      setInvitedTrips(data.invitedTrips || []);
      setTrips([...(data.createdTrips || []), ...(data.invitedTrips || [])]);
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
      <div className="d-flex align-items-center justify-content-between mb-3">
        <p className="mb-0">Welcome to Your Dashboard</p>
        <Button variant="outline-danger" onClick={logout}>Logout</Button>
      </div>

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
              if (createdTrips.length > 0) {
                setSelectedTripId(createdTrips[0]._id);
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

      {/* Trip List */}
      <TripList
        trips={trips}
        loading={loading}
        onTripClick={handleTripClick}
        error={loading ? '' : 'Failed to load trips'}
      />
    </Container>
  );
}

export default DashboardPage;
