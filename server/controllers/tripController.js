import Trip from '../models/Trip.js';
import User from '../models/User.js';
import generateTripCode from '../utils/generateTripCode.js';

// @desc    Create a new trip
// @route   POST /api/trips
export const createTrip = async (req, res) => {
  try {
    const { name, startDate, endDate, budget } = req.body;
    const tripCode = generateTripCode();

    const newTrip = await Trip.create({
      name,
      startDate,
      endDate,
      budget,
      creator: req.user._id,
      tripCode,
      participants: [req.user._id],
      activities: []
    });

    // Add trip to user's tripsCreated
    await User.findByIdAndUpdate(req.user._id, {
      $push: { tripsCreated: newTrip._id }
    });

    res.status(201).json({ message: 'Trip created successfully!', trip: newTrip });
  } catch (error) {
    console.error('Trip creation error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

// @desc    Get trips user created or was invited to
// @route   GET /api/trips
export const getUserTrips = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('tripsCreated')
      .populate('tripsInvited');

    res.status(200).json({
      createdTrips: user.tripsCreated,
      invitedTrips: user.tripsInvited
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch trips' });
  }
};

// @desc    Get detailed trip info
// @route   GET /api/trips/:tripId
export const getTripById = async (req, res) => {
  try {
    console.log("Trip Id: ", req.params.tripId);
    
    const trip = await Trip.findById(req.params.tripId)
      // .populate('activities')
      // .populate('participants', 'name email');

    console.log("Trip: ", trip);
    

    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Check if user is part of the trip
    const isParticipant = trip.participants.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!isParticipant)
      return res.status(403).json({ error: 'Access denied to this trip' });

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trip details' });
  }
};

// @desc    Delete trip (creator only)
// @route   DELETE /api/trips/:tripId
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    if (trip.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Only creator can delete this trip' });

    await Trip.findByIdAndDelete(trip._id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { tripsCreated: trip._id }
    });

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting trip' });
  }
};
