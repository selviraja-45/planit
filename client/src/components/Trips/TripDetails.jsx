import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import API from '../../api'; 

function TripDetailsPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          {/* Activities and other sections go here */}
        </>
      )}
    </Container>
  );
}

export default TripDetailsPage;
