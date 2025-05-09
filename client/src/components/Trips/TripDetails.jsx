// pages/TripDetailsPage.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import API from '../../api';
import ActivityList from '../Activities/ActivityList';
import { useAuth } from '../../contexts/AuthContext';
import TripList from '../Trips/TripList'; // ✅ Import TripList

function TripDetailsPage() {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

        console.log("Data: ", data);
        
  
        // Check if startDate and endDate are valid before converting to Date objects
        if (Date.parse(data.startDate)) {
          data.startDate = new Date(data.startDate);
        } else {
          throw new Error('Invalid start date');
        }
  
        if (Date.parse(data.endDate)) {
          data.endDate = new Date(data.endDate);
        } else {
          throw new Error('Invalid end date');
        }
  
        setTrip(data);
      } catch (err) {
        console.error('Trip fetch failed:', err);
        setError(err?.message || 'Could not load trip details');
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
      ) : trip ? (
        <>
          <h2>{trip.name}</h2>
          <p><strong>Budget:</strong> ${trip.budget}</p>
          <p><strong>Participants:</strong> {trip.participants?.length} users</p>
          <ActivityList tripId={tripId} userId={user?._id} />
        </>
      ) : (
        <Alert variant="info">No trip details available.</Alert>
      )}

      {/* Trip List (for user’s other trips) */}
      <h4 className="mt-4">Other Trips</h4>
      <TripList
        trips={[trip]} // Only the current trip
        loading={loading}
        onTripClick={(tripId) => navigate(`/trip/${tripId}`)}
        error={error}
      />
    </Container>
  );
}

export default TripDetailsPage;
