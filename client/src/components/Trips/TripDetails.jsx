import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import API from '../../api';
import ActivityList from '../Activities/ActivityList';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to access user

function TripDetailsPage() {
  const { tripId } = useParams();
  const { user } = useAuth(); // Get the user from the AuthContext
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  console.log("Trip ID from URL:", tripId); // Check this appears

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);


  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setError('');
        setLoading(true);
        const { data } = await API.get(`/trips/${tripId}`);
        setTrip(data);
      } catch (err) {
        console.error('Trip fetch failed:', err);
        setError(err?.response?.data?.message || 'Could not load trip details');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  return (
    <Container className="mt-4">
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <h2>{trip.name}</h2>
          <p><strong>Dates:</strong> {trip.startDate?.slice(0, 10)} to {trip.endDate?.slice(0, 10)}</p>
          <p><strong>Budget:</strong> ${trip.budget}</p>
          <p><strong>Participants:</strong> {trip.participants?.length} users</p>

          {/* Pass user._id to ActivityList */}
          <ActivityList tripId={tripId} userId={user?._id} />
        </>
      )}
    </Container>
  );
}

export default TripDetailsPage;
