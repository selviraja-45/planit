import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

function TripDetailsPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`, { credentials: 'include' });
        const data = await response.json();
        setTrip(data);
      } catch (err) {
        alert('Could not load trip details');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-4">
      <h2>{trip.name}</h2>
      <p><strong>Dates:</strong> {trip.startDate?.slice(0, 10)} to {trip.endDate?.slice(0, 10)}</p>
      <p><strong>Budget:</strong> ${trip.budget}</p>
      <p><strong>Participants:</strong> {trip.participants?.length} users</p>
      {/* Activities and other sections go here */}
    </Container>
  );
}

export default TripDetailsPage;
