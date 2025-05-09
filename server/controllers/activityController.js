import Activity from '../models/Activity.js';
import Trip from '../models/Trip.js';

export const addActivity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, dateTime, category, estimatedCost, notes } = req.body;
    const userId = req.user._id;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const newActivity = await Activity.create({
      tripId,
      title,
      dateTime,
      category,
      estimatedCost,
      notes,
      createdBy: userId
    });

    trip.activities.push(newActivity._id);
    await trip.save();

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const { tripId } = req.params;
    const activities = await Activity.find({ tripId }).sort({ dateTime: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    const isParticipant = await Trip.findOne({
      _id: activity.tripId,
      participants: userId
    });

    if (!isParticipant) return res.status(403).json({ message: 'Not authorized to edit this activity' });

    Object.assign(activity, req.body);
    await activity.save();
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    if (!activity.createdBy.equals(userId)) {
      return res.status(403).json({ message: 'Only the creator can delete the activity' });
    }

    await Trip.findByIdAndUpdate(activity.tripId, {
      $pull: { activities: activity._id }
    });

    await Activity.deleteOne({ _id: activityId });

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
