import express from 'express';
import {
    createTrip,
    getUserTrips,
    getTripById,
    deleteTrip
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

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

export default router;
