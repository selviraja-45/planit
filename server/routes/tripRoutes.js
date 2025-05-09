import express from 'express';
import {
    createTrip,
    getUserTrips,
    getTripById,
    deleteTrip,
    inviteUserToTrip,
    joinTripWithCode
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';
import { addActivity, getActivities } from '../controllers/activityController.js';

const router = express.Router();

/**
 * @route   POST /api/trips
 * @desc    Creates a new trip with name, dates and budget
 * @accesss Private
 */
router.post('/', protect, createTrip);

/**
 * @route   GET /api/trips
 * @desc    Returns trips created or invited to
 * @access  Private
 */
router.get('/', protect, getUserTrips);

/**
 * @route   GET /api/trips/:tripId
 * @desc    Gets detailed trip data (with activities)
 * @access  Private
 */
router.get('/:tripId', protect, getTripById);

/**
 * @route   GET /api/trips/:tripId
 * @desc    Deletes a trip (only if user is creator)
 * @access  Private
 */
router.delete('/:tripId', protect, deleteTrip);

router.post('/:tripId/invite', protect, inviteUserToTrip);

router.post('/join/:tripCode', protect, joinTripWithCode);

router.post('/:tripId/activities', protect, addActivity);

router.get('/:tripId/activities', protect, getActivities);

export default router;
