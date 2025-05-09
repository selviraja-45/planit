import express from 'express';
import {
  updateActivity,
  deleteActivity
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:activityId', protect, updateActivity);

router.delete('/:activityId',protect, deleteActivity);

export default router;
