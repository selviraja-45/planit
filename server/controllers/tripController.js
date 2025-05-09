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

// Invite by Email
export const inviteUserToTrip = async (req, res) => {
  const { tripId } = req.params;
  const { email } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) return res.status(404).json({ message: 'User not found with that email' });

    if (trip.participants.includes(userToInvite._id)) {
      return res.status(400).json({ message: 'User already a participant' });
    }

    trip.participants.push(userToInvite._id);
    await trip.save();

    userToInvite.tripsInvited.push(trip._id);
    await userToInvite.save();

    res.status(200).json({ message: 'User invited successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while inviting user' });
  }
};

// Join with Trip Code
export const joinTripWithCode = async (req, res) => {
  const { tripCode } = req.params;
  const userId = req.user.id;

  try {
    const trip = await Trip.findOne({ tripCode });
    if (!trip) return res.status(404).json({ message: 'Trip not found with provided code' });

    if (trip.participants.includes(userId)) {
      return res.status(400).json({ message: 'You are already part of this trip' });
    }

    trip.participants.push(userId);
    await trip.save();

    const user = await User.findById(userId);
    user.tripsInvited.push(trip._id);
    await user.save();

    res.status(200).json({ message: 'Successfully joined trip!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while joining trip' });
  }
};