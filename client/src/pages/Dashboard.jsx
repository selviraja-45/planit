import { useEffect, useState } from 'react';
import { Button, Container, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TripFormModal from '../components/Trips/TripFormModal';
import API from '../api'; 

function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      
      const { data } = await API.get('/trips', { withCredentials: true });

      console.log("Data: ", data);
      

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
      <h2>Welcome to Your Dashboard</h2>
      <Button variant="primary" className="my-3" onClick={() => setShowModal(true)}>
        Create Trip
      </Button>

      <TripFormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onTripCreated={fetchTrips}
      />

      <h4>Your Trips</h4>
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
