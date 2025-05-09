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

  const convertToDate = (dateInput) => {
    if (!dateInput) return null;
  
    if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? null : date;
    }
  
    if (typeof dateInput === 'object' && dateInput.$date) {
      const date = new Date(dateInput.$date);
      return isNaN(date.getTime()) ? null : date;
    }
  
    return null; // fallback
  };  
  
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setError('');
        setLoading(true);
        const { data } = await API.get(`/trips/${tripId}`);

        console.log("Data: ", data);

        // Convert startDate and endDate to valid Date objects
        if (data.startDate) {
          data.startDate = convertToDate(data.startDate);
        }
  
        if (data.endDate) {
          data.endDate = convertToDate(data.endDate);
        }
  
        console.log("Raw startDate:", data.startDate);
        console.log("Raw endDate:", data.endDate);
        
        console.log("Converted startDate:", convertToDate(data.startDate));
        console.log("Converted endDate:", convertToDate(data.endDate));
  
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
          <p><strong>Dates:</strong> 
            {trip.startDate ? trip.startDate.toISOString().slice(0, 10) : 'N/A'} 
            to 
            {trip.endDate ? trip.endDate.toISOString().slice(0, 10) : 'N/A'}
          </p>
          <p><strong>Budget:</strong> ${trip.budget}</p>
          <p><strong>Participants:</strong> {trip.participants?.length} users</p>

          {/* Pass user._id to ActivityList */}
          <ActivityList tripId={tripId} userId={user?._id} />
        </>
      ) : (
        <Alert variant="info">No trip details available.</Alert>
      )}
    </Container>
  );
}

export default TripDetailsPage;
